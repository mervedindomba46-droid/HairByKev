import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Star, Quote, X, Loader2, PenLine } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { REVIEWS, ALL_SERVICE_NAMES } from "../data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Stars = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) =>
      onChange ? (
        <button key={n} type="button" data-testid={`rating-star-${n}`} onClick={() => onChange(n)} className="p-0.5" aria-label={`${n} star${n > 1 ? "s" : ""}`}>
          <Star size={22} className={n <= value ? "fill-gold text-gold" : "text-taupe hover:text-gold/60 transition-colors"} />
        </button>
      ) : (
        <Star key={n} size={13} className={n <= value ? "fill-gold text-gold" : "text-taupe"} />
      )
    )}
  </div>
);

const ReviewCard = ({ review, index, live }) => (
  <Reveal delay={(index % 3) * 0.1}>
    <figure
      data-testid={`review-card-${review.id}`}
      className="spotlight-card relative h-full border border-linen/10 bg-espresso-3/50 p-8 flex flex-col"
    >
      <Quote size={22} className="text-gold/40" />
      <blockquote className="mt-5 text-sm sm:text-base text-sand font-light leading-relaxed flex-1">
        "{review.text}"
      </blockquote>
      <figcaption className="mt-8 pt-6 border-t border-linen/10">
        <Stars value={review.rating || 5} />
        <p className="mt-3 font-serif text-lg text-linen">{review.name}</p>
        <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
          {[review.tag, review.service, live ? "Verified client review" : null].filter(Boolean).join(" · ")}
        </p>
      </figcaption>
    </figure>
  </Reveal>
);

export const ClientReviews = () => {
  const [live, setLive] = useState([]);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", service: "", rating: 5, text: "" });

  useEffect(() => {
    axios.get(`${API}/reviews`).then((res) => setLive(res.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/reviews`, { ...form, service: form.service || null });
      setOpen(false);
      setForm({ name: "", service: "", rating: 5, text: "" });
      toast.success("Thank you — your review will appear once Kev approves it.");
    } catch {
      toast.error("Could not save your review — please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="reviews" data-testid="reviews-section" className="relative py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Client Words"
          title={<>Crowns that <span className="italic text-gold">speak for themselves.</span></>}
          align="center"
        />
        <Reveal delay={0.15} className="mt-10 text-center">
          <button
            data-testid="review-open-button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 border border-gold/60 text-gold text-xs font-mono uppercase tracking-[0.22em] px-8 py-4 hover:bg-gold hover:text-espresso transition-colors duration-300"
          >
            <PenLine size={14} /> Share your experience
          </button>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {live.map((r, i) => (
            <ReviewCard key={r.id} review={r} index={i} live />
          ))}
          {REVIEWS.map((r, i) => (
            <ReviewCard key={r.id} review={r} index={i + live.length} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="review-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-espresso/85 backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg bg-espresso-2 border border-linen/10 p-8 sm:p-10 gold-frame max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                data-testid="review-modal-close"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center border border-linen/15 text-linen hover:text-gold hover:border-gold/50 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <p className="eyebrow">Your words</p>
              <h3 className="mt-3 font-serif text-3xl text-linen">How was your crown?</h3>

              <div className="mt-8 space-y-6">
                <label className="block">
                  <span className="eyebrow !text-[10px] block mb-2.5">Your name *</span>
                  <input
                    data-testid="review-input-name"
                    required
                    minLength={2}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Naledi M."
                    className="field-input"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow !text-[10px] block mb-2.5">Service you had</span>
                  <select
                    data-testid="review-select-service"
                    value={form.service}
                    onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                    className="field-input"
                  >
                    <option value="">Choose a service</option>
                    {ALL_SERVICE_NAMES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <span className="eyebrow !text-[10px] block mb-2.5">Rating *</span>
                  <Stars value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
                </div>
                <label className="block">
                  <span className="eyebrow !text-[10px] block mb-2.5">Your review *</span>
                  <textarea
                    data-testid="review-input-text"
                    required
                    minLength={10}
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                    placeholder="Tell others about your experience…"
                    className="field-input resize-none"
                  />
                </label>
              </div>

              <button
                data-testid="review-submit-button"
                type="submit"
                disabled={sending}
                className="mt-8 w-full bg-gold text-espresso text-xs font-mono uppercase tracking-[0.24em] py-4 hover:bg-gold-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {sending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Posting…
                  </>
                ) : (
                  "Post review"
                )}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
