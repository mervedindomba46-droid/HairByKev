import os
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional

import requests
from fastapi import APIRouter, HTTPException, Header, UploadFile, File, Form, Response
from pydantic import BaseModel, Field, ConfigDict

from database import db

logger = logging.getLogger(__name__)

extra_router = APIRouter(prefix="/api")

OWNER_CODE = os.environ.get("OWNER_UPLOAD_CODE", "")
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "hairbykev"

_storage_key = None


def init_storage(force: bool = False):
    global _storage_key
    if _storage_key and not force:
        return _storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data,
            timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str) -> tuple:
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


def require_owner(code: Optional[str]):
    if not OWNER_CODE or code != OWNER_CODE:
        raise HTTPException(status_code=403, detail="Invalid owner code")


# ---------- Reviews ----------

class ReviewCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    service: Optional[str] = Field(default=None, max_length=120)
    rating: int = Field(..., ge=1, le=5)
    text: str = Field(..., min_length=10, max_length=600)


class Review(ReviewCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "pending"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@extra_router.post("/reviews", response_model=Review, status_code=201)
async def create_review(input: ReviewCreate):
    review = Review(**input.model_dump())
    await db.reviews.insert_one(review.model_dump())
    return review


@extra_router.get("/reviews", response_model=list[Review])
async def list_reviews():
    return await db.reviews.find({"status": "approved"}, {"_id": 0}).sort("created_at", -1).to_list(100)


class ReviewStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected)$")


@extra_router.get("/admin/reviews")
async def admin_list_reviews(x_owner_code: Optional[str] = Header(default=None)):
    require_owner(x_owner_code)
    return await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(300)


@extra_router.patch("/admin/reviews/{review_id}")
async def admin_set_review_status(review_id: str, input: ReviewStatusUpdate, x_owner_code: Optional[str] = Header(default=None)):
    require_owner(x_owner_code)
    res = await db.reviews.update_one({"id": review_id}, {"$set": {"status": input.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"ok": True, "status": input.status}


# ---------- Bookings dashboard ----------

class BookingStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(confirmed|completed|cancelled)$")


@extra_router.get("/admin/bookings")
async def admin_list_bookings(x_owner_code: Optional[str] = Header(default=None)):
    require_owner(x_owner_code)
    return await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@extra_router.patch("/admin/bookings/{booking_id}")
async def admin_set_booking_status(booking_id: str, input: BookingStatusUpdate, x_owner_code: Optional[str] = Header(default=None)):
    require_owner(x_owner_code)
    res = await db.bookings.update_one({"id": booking_id}, {"$set": {"status": input.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True, "status": input.status}


# ---------- Owner check ----------

@extra_router.get("/admin/check")
async def admin_check(x_owner_code: Optional[str] = Header(default=None)):
    require_owner(x_owner_code)
    return {"ok": True}


# ---------- Gallery photos (object storage) ----------

@extra_router.post("/photos", status_code=201)
async def upload_photo(
    file: UploadFile = File(...),
    title: str = Form(...),
    category: str = Form(...),
    service: Optional[str] = Form(default=None),
    description: Optional[str] = Form(default=None),
    x_owner_code: Optional[str] = Header(default=None),
):
    require_owner(x_owner_code)
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image too large (max 10 MB)")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    if ext == "jpeg":
        ext = "jpg"
    path = f"{APP_NAME}/gallery/{uuid.uuid4()}.{ext}"
    try:
        result = put_object(path, data, file.content_type)
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=502, detail="Photo storage unavailable — please try again")
    doc = {
        "id": str(uuid.uuid4()),
        "path": result["path"],
        "title": title.strip()[:120],
        "category": category.strip()[:40],
        "service": (service or "").strip()[:120] or None,
        "description": (description or "").strip()[:400],
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.photos.insert_one(doc)
    doc.pop("_id", None)
    return doc


@extra_router.get("/photos")
async def list_photos():
    return await db.photos.find({"is_deleted": False}, {"_id": 0}).sort("created_at", -1).to_list(200)


@extra_router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str, x_owner_code: Optional[str] = Header(default=None)):
    require_owner(x_owner_code)
    res = await db.photos.update_one({"id": photo_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"ok": True}


@extra_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.photos.find_one({"path": path, "is_deleted": False})
    if not record:
        record = await db.photo_overrides.find_one({"path": path})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found in storage")
    return Response(
        content=data,
        media_type=record.get("content_type") or content_type,
        headers={"Cache-Control": "public, max-age=86400"},
    )


# ---------- Showcase photo overrides (replace the six default gallery images) ----------

GALLERY_IDS = {"knotless-boho", "waist-length-braids", "fulani-shells", "geometry-scalp", "macro-scalp-detail", "crown-updo"}


@extra_router.post("/photos/replace/{gallery_id}")
async def replace_gallery_photo(gallery_id: str, file: UploadFile = File(...), x_owner_code: Optional[str] = Header(default=None)):
    require_owner(x_owner_code)
    if gallery_id not in GALLERY_IDS:
        raise HTTPException(status_code=404, detail="Unknown gallery style")
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image too large (max 10 MB)")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    if ext == "jpeg":
        ext = "jpg"
    path = f"{APP_NAME}/gallery/override-{gallery_id}-{uuid.uuid4().hex[:8]}.{ext}"
    try:
        result = put_object(path, data, file.content_type)
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=502, detail="Photo storage unavailable — please try again")
    doc = {
        "gallery_id": gallery_id,
        "path": result["path"],
        "content_type": file.content_type,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.photo_overrides.update_one({"gallery_id": gallery_id}, {"$set": doc}, upsert=True)
    return doc


@extra_router.get("/photos/overrides")
async def list_overrides():
    return await db.photo_overrides.find({}, {"_id": 0}).to_list(50)


@extra_router.delete("/photos/overrides/{gallery_id}")
async def reset_override(gallery_id: str, x_owner_code: Optional[str] = Header(default=None)):
    require_owner(x_owner_code)
    await db.photo_overrides.delete_one({"gallery_id": gallery_id})
    return {"ok": True}
