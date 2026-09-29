import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Loader2, Lock, Trash2 } from "lucide-react";
import { ALL_SERVICE_NAMES, GALLERY } from "../data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CATEGORIES = ["Knotless", "Cornrows", "Goddess", "Updos", "Sew In", "Hair Treatment"];
const CODE_KEY = "hbk_owner_code";

export default function AdminPage() {
  const [code, setCode] = useState(() => localStorage.getItem(CODE_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ title: "", category: "Knotless", service: "", description: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const headers = { "X-Owner-Code": code };

  const [tab, setTab] = useState("bookings");
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);

  const ownerHeaders = () => ({ "X-Owner-Code": localStorage.getItem(CODE_KEY) || code });

  const [overrides, setOverrides] = useState({});
  const [replacing, setReplacing] = useState(null);

  const loadPhotos = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/photos`);
      setPhotos(res.data);
    } catch {
      /* gallery stays as-is */
    }
    try {
      const res = await axios.get(`${API}/photos/overrides`);
      const m = {};
      res.data.forEach((o) => {
        m[o.gallery_id] = `${API}/files/${o.path}`;
      });
      setOverrides(m);
    } catch {
      /* keep defaults */
    }
  }, []);

  const replaceStyle = async (galleryId, f) => {
    if (!f) return;
    setReplacing(galleryId);
    try {
      const fd = new FormData();
      fd.append("file", f);
      await axios.post(`${API}/photos/replace/${galleryId}`, fd, { headers: ownerHeaders() });
      toast.success("Showcase photo replaced");
      loadPhotos();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Replace failed — please try again");
    } finally {
      setReplacing(null);
    }
  };

  const resetStyle = async (galleryId) => {
    try {
      await axios.delete(`${API}/photos/overrides/${galleryId}`, { headers: ownerHeaders() });
      toast.success("Original photo restored");
      loadPhotos();
    } catch {
      toast.error("Could not restore original");
    }
  };

  const loadReviews = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/reviews`, { headers: ownerHeaders() });
      setReviews(res.data);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const loadBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/bookings`, { headers: ownerHeaders() });
      setBookings(res.data);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const verify = useCallback(
    async (candidate) => {
      if (!candidate) return;
      setChecking(true);
      try {
        await axios.get(`${API}/admin/check`, { headers: { "X-Owner-Code": candidate } });
        localStorage.setItem(CODE_KEY, candidate);
        setAuthed(true);
        loadPhotos();
        loadReviews();
        loadBookings();
      } catch {
        localStorage.removeItem(CODE_KEY);
        toast.error("Wrong passcode");
      } finally {
        setChecking(false);
      }
    },
    [loadPhotos, loadReviews, loadBookings]
  );

  useEffect(() => {
    if (code) verify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setReviewStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/admin/reviews/${id}`, { status }, { headers: ownerHeaders() });
      setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
      toast.success(status === "approved" ? "Review published" : "Review rejected");
    } catch {
      toast.error("Could not update review");
    }
  };

  const setBookingStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/admin/bookings/${id}`, { status }, { headers: ownerHeaders() });
      setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
      toast.success(`Booking marked ${status}`);
    } catch {
      toast.error("Could not update booking");
    }
  };

  const TABS = [
    { id: "bookings", label: "Bookings", testid: "admin-tab-bookings", count: bookings.filter((b) => b.status === "new").length },
    { id: "reviews", label: "Reviews", testid: "admin-tab-reviews", count: reviews.filter((r) => r.status === "pending").length },
    { id: "photos", label: "Photos", testid: "admin-tab-photos", count: 0 },
  ];

  const StatusBadge = ({ status }) => {
    const styles = {
      new: "border-gold/60 text-gold",
      pending: "border-gold/60 text-gold",
      confirmed: "border-emerald-400/50 text-emerald-300",
      approved: "border-emerald-400/50 text-emerald-300",
      completed: "border-linen/30 text-sand",
      rejected: "border-red-400/50 text-red-300",
      cancelled: "border-red-400/50 text-red-300",
    };
    return (
      <span className={`text-[10px] font-mono uppercase tracking-[0.2em] border px-3 py-1 ${styles[status] || "border-linen/20 text-taupe"}`}>
        {status}
      </span>
    );
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Choose a photo first");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", form.title);
      fd.append("category", form.category);
      if (form.service) fd.append("service", form.service);
      if (form.description) fd.append("description", form.description);
      await axios.post(`${API}/photos`, fd, { headers });
      toast.success("Photo added to the gallery");
      setForm({ title: "", category: "Knotless", service: "", description: "" });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      loadPhotos();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`${API}/photos/${id}`, { headers });
      setPhotos((p) => p.filter((x) => x.id !== id));
      toast.success("Photo removed");
    } catch {
      toast.error("Could not remove photo");
    }
  };

  if (!authed) {
    return (
      <div data-testid="admin-page" className="min-h-screen bg-espresso flex items-center justify-center px-6">
        <div className="w-full max-w-sm border border-linen/10 bg-espresso-3/50 p-10">
          <Lock size={20} className="text-gold" />
          <h1 className="mt-5 font-serif text-3xl text-linen">Owner access</h1>
          <p className="mt-2 text-sm text-sand font-light">Enter your passcode to manage gallery photos.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verify(code);
            }}
            className="mt-8 space-y-4"
          >
            <input
              data-testid="admin-code-input"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Owner passcode"
              className="field-input"
            />
            <button
              data-testid="admin-login-button"
              disabled={checking}
              className="w-full bg-gold text-espresso text-xs font-mono uppercase tracking-[0.22em] py-4 hover:bg-gold-hover transition-colors flex items-center justify-center gap-2"
            >
              {checking ? <Loader2 size={15} className="animate-spin" /> : "Unlock"}
            </button>
          </form>
          <a
            data-testid="admin-back-link"
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-taupe hover:text-gold transition-colors"
          >
            <ArrowLeft size={13} /> Back to site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-espresso py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="eyebrow">Hair By Kev</p>
            <h1 className="mt-2 font-serif text-4xl text-linen">Studio manager</h1>
          </div>
          <a
            data-testid="admin-back-link"
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-taupe hover:text-gold transition-colors"
          >
            <ArrowLeft size={13} /> View site
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              data-testid={t.testid}
              onClick={() => setTab(t.id)}
              className={`text-[11px] font-mono uppercase tracking-[0.2em] px-6 py-3 border transition-colors duration-300 flex items-center ${
                tab === t.id ? "border-gold bg-gold text-espresso" : "border-linen/15 text-sand hover:border-gold/50 hover:text-linen"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  data-testid={`${t.testid}-count`}
                  className={`ml-2.5 px-2 py-0.5 text-[10px] ${tab === t.id ? "bg-espresso text-gold" : "bg-gold/15 text-gold"}`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "bookings" && (
          <div className="mt-10 space-y-5">
            {bookings.length === 0 ? (
              <p data-testid="admin-bookings-empty" className="text-sm text-taupe font-light border border-linen/10 p-8 text-center">
                No booking enquiries yet.
              </p>
            ) : (
              bookings.map((b) => (
                <div key={b.id} data-testid={`admin-booking-${b.id}`} className="border border-linen/10 bg-espresso-3/40 p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-serif text-2xl text-linen">{b.name}</p>
                      <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-gold">{b.reference}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="mt-5 grid sm:grid-cols-3 gap-x-8 gap-y-4 text-sm text-sand font-light">
                    <p>
                      <span className="text-taupe text-[10px] font-mono uppercase tracking-[0.18em] block mb-1">Service</span>
                      {b.service}
                    </p>
                    <p>
                      <span className="text-taupe text-[10px] font-mono uppercase tracking-[0.18em] block mb-1">Preferred date</span>
                      {b.date}
                    </p>
                    <p>
                      <span className="text-taupe text-[10px] font-mono uppercase tracking-[0.18em] block mb-1">Phone</span>
                      {b.phone}
                    </p>
                    {b.size && (
                      <p>
                        <span className="text-taupe text-[10px] font-mono uppercase tracking-[0.18em] block mb-1">Braid size</span>
                        {b.size}
                      </p>
                    )}
                    <p>
                      <span className="text-taupe text-[10px] font-mono uppercase tracking-[0.18em] block mb-1">WhatsApp confirm</span>
                      {b.whatsapp ? "Yes" : "No"}
                    </p>
                  </div>
                  {b.notes && (
                    <p className="mt-5 text-sm text-sand font-light border-l-2 border-gold/40 pl-4">"{b.notes}"</p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {b.status === "new" && (
                      <button
                        data-testid={`admin-booking-confirm-${b.id}`}
                        onClick={() => setBookingStatus(b.id, "confirmed")}
                        className="bg-gold text-espresso text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-2.5 hover:bg-gold-hover transition-colors"
                      >
                        Confirm booking
                      </button>
                    )}
                    {b.status === "confirmed" && (
                      <button
                        data-testid={`admin-booking-complete-${b.id}`}
                        onClick={() => setBookingStatus(b.id, "completed")}
                        className="border border-emerald-400/50 text-emerald-300 text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-2.5 hover:bg-emerald-400/10 transition-colors"
                      >
                        Mark completed
                      </button>
                    )}
                    {(b.status === "new" || b.status === "confirmed") && (
                      <button
                        data-testid={`admin-booking-cancel-${b.id}`}
                        onClick={() => setBookingStatus(b.id, "cancelled")}
                        className="border border-linen/15 text-sand text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-2.5 hover:text-red-300 hover:border-red-400/40 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <a
                      data-testid={`admin-booking-message-${b.id}`}
                      href={`https://wa.me/${String(b.phone).replace(/[^0-9]/g, "").replace(/^0/, "27")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-linen/15 text-sand text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-2.5 hover:text-gold hover:border-gold/50 transition-colors"
                    >
                      Message client
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div className="mt-10 space-y-5">
            {reviews.length === 0 ? (
              <p data-testid="admin-reviews-empty" className="text-sm text-taupe font-light border border-linen/10 p-8 text-center">
                No reviews submitted yet.
              </p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} data-testid={`admin-review-${r.id}`} className="border border-linen/10 bg-espresso-3/40 p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-serif text-2xl text-linen">{r.name}</p>
                      <div className="mt-1.5 flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span key={n} className={`text-xs ${n <= r.rating ? "text-gold" : "text-taupe/40"}`}>★</span>
                        ))}
                      </div>
                      {r.service && (
                        <p className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">{r.service}</p>
                      )}
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-4 text-sm text-sand font-light leading-relaxed">"{r.text}"</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {r.status !== "approved" && (
                      <button
                        data-testid={`admin-review-approve-${r.id}`}
                        onClick={() => setReviewStatus(r.id, "approved")}
                        className="bg-gold text-espresso text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-2.5 hover:bg-gold-hover transition-colors"
                      >
                        Approve & publish
                      </button>
                    )}
                    {r.status !== "rejected" && (
                      <button
                        data-testid={`admin-review-reject-${r.id}`}
                        onClick={() => setReviewStatus(r.id, "rejected")}
                        className="border border-linen/15 text-sand text-[10px] font-mono uppercase tracking-[0.2em] px-5 py-2.5 hover:text-red-300 hover:border-red-400/40 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "photos" && (
        <>
        <div className="mt-12">
          <p className="eyebrow mb-6">Showcase styles — replace the six main gallery photos</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {GALLERY.map((g) => (
              <div key={g.id} data-testid={`admin-style-${g.id}`} className="border border-linen/10 overflow-hidden bg-espresso-3">
                <img src={overrides[g.id] || g.img} alt={g.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <p className="font-serif text-base text-linen truncate">{g.title}</p>
                  {overrides[g.id] && (
                    <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-300">Your photo</p>
                  )}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <label
                      data-testid={`admin-style-replace-${g.id}`}
                      className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] border border-gold/60 text-gold px-4 py-2 hover:bg-gold hover:text-espresso transition-colors"
                    >
                      {replacing === g.id ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          replaceStyle(g.id, e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {overrides[g.id] && (
                      <button
                        data-testid={`admin-style-reset-${g.id}`}
                        onClick={() => resetStyle(g.id)}
                        className="text-[10px] font-mono uppercase tracking-[0.18em] border border-linen/15 text-sand px-4 py-2 hover:text-gold hover:border-gold/50 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={upload} className="mt-12 border border-linen/10 bg-espresso-3/40 p-8 sm:p-10">
          <p className="eyebrow mb-6 flex items-center gap-2">
            <ImagePlus size={14} /> Add your work
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <label className="block sm:col-span-2">
              <span className="eyebrow !text-[10px] block mb-2.5">Photo *</span>
              <input
                data-testid="admin-file-input"
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="field-input file:mr-4 file:bg-gold file:text-espresso file:border-0 file:px-4 file:py-1.5 file:text-xs file:font-mono file:uppercase file:tracking-widest file:cursor-pointer"
              />
            </label>
            <label className="block">
              <span className="eyebrow !text-[10px] block mb-2.5">Title *</span>
              <input
                data-testid="admin-input-title"
                required
                minLength={2}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Honey knotless, waist length"
                className="field-input"
              />
            </label>
            <label className="block">
              <span className="eyebrow !text-[10px] block mb-2.5">Category *</span>
              <select
                data-testid="admin-select-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="field-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow !text-[10px] block mb-2.5">Linked service (optional)</span>
              <select
                data-testid="admin-select-service"
                value={form.service}
                onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                className="field-input"
              >
                <option value="">None</option>
                {ALL_SERVICE_NAMES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow !text-[10px] block mb-2.5">Caption (optional)</span>
              <input
                data-testid="admin-input-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short note about this look"
                className="field-input"
              />
            </label>
          </div>
          <button
            data-testid="admin-upload-button"
            type="submit"
            disabled={uploading}
            className="mt-8 bg-gold text-espresso text-xs font-mono uppercase tracking-[0.22em] px-10 py-4 hover:bg-gold-hover transition-colors disabled:opacity-60 flex items-center gap-3"
          >
            {uploading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Uploading…
              </>
            ) : (
              "Add to gallery"
            )}
          </button>
        </form>

        <div className="mt-14">
          <p className="eyebrow mb-6">Live photos ({photos.length})</p>
          {photos.length === 0 ? (
            <p data-testid="admin-empty-state" className="text-sm text-taupe font-light border border-linen/10 p-8 text-center">
              No uploaded photos yet — the six styled showcase images are showing on the site.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {photos.map((p) => (
                <div key={p.id} data-testid={`admin-photo-${p.id}`} className="relative group border border-linen/10 overflow-hidden bg-espresso-3">
                  <img src={`${API}/files/${p.path}`} alt={p.title} className="w-full h-56 object-cover" />
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-serif text-base text-linen truncate">{p.title}</p>
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">{p.category}</p>
                    </div>
                    <button
                      data-testid={`admin-photo-delete-${p.id}`}
                      onClick={() => remove(p.id)}
                      className="shrink-0 w-9 h-9 flex items-center justify-center border border-linen/15 text-sand hover:text-red-400 hover:border-red-400/50 transition-colors"
                      aria-label={`Delete ${p.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
