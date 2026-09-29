from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import client, db

app = FastAPI()
api_router = APIRouter(prefix="/api")


class BookingCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=6, max_length=30)
    email: Optional[EmailStr] = None
    service: str = Field(..., min_length=2, max_length=120)
    size: Optional[str] = None
    date: str = Field(..., min_length=4, max_length=40)
    notes: Optional[str] = Field(default=None, max_length=1000)
    whatsapp: bool = True


class Booking(BookingCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    reference: str = Field(default_factory=lambda: "HBK-" + uuid.uuid4().hex[:6].upper())
    status: str = "new"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@api_router.get("/")
async def root():
    return {"message": "Maison de Tresse API"}


@api_router.post("/bookings", response_model=Booking, status_code=201)
async def create_booking(input: BookingCreate):
    booking = Booking(**input.model_dump())
    doc = booking.model_dump()
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings():
    return await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


from extra_routes import extra_router, init_storage

app.include_router(api_router)
app.include_router(extra_router)


@app.on_event("startup")
async def startup_storage():
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
