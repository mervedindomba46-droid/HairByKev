import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Check, Loader2, MessageCircle, RotateCcw } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { SERVICE_PRICING, ALL_SERVICE_NAMES, depositWhatsAppUrl } from "../data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const ALL_SERVICES = ALL_SERVICE_NAMES;
const SIZES = ["Small", "Medium", "Large", "Jumbo", "Not sure — advise me"];

const empty = { name: "", phone: "", email: "", service: "", size: "", date: "", notes: "", whatsapp: true };

export const BookingForm = ({ prefill }) => {
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (prefill) setForm((f) => ({ ...f, service: prefill }));
  }, [prefill]);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(`${API}/bookings`, { ...form, email: form.email || null, size: form.size || null, notes: form.notes || null });
      setReceipt(res.data);
      toast.success("Enquiry received — we'll confirm within a few hours.", { id: "booking-success-toast" });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Something went wrong — please try again or message us on WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="booking" data-testid="booking-section" className="relative py-28 lg:py-36 bg-espresso-2/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="Reserve Your Chair"
              title={<>Tell us the look. <span className="italic text-gold">We handle the rest.</span></>}
              copy="Send an enquiry and we'll confirm your time, quote and prep steps within a few hours. A 30% deposit secures the chair."
            />
            <Reveal delay={0.2} className="mt-10 space-y-4">
              {["Response within a few hours", "Premium fibre included", "House calls across Sandton"].map((t) => (
                <p key={t} className="flex items-center gap-3 text-sm text-sand font-light">
                  <Check size={15} className="text-gold shrink-0" /> {t}
                </p>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {receipt ? (
              <motion.div
                key="receipt"
                data-testid="booking-receipt"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="border border-gold/30 bg-espresso-3/60 p-10 sm:p-14 text-center gold-frame"
              >
                <div className="mx-auto w-14 h-14 border border-gold/50 flex items-center justify-center rotate-45">
                  <Check size={22} className="text-gold -rotate-45" />
                </div>
                <h3 className="mt-8 font-serif text-3xl text-linen">Enquiry received, {receipt.name.split(" ")[0]}.</h3>
                <p className="mt-4 text-sm text-sand font-light leading-relaxed max-w-md mx-auto">
                  Your request for <span className="text-linen">{receipt.service}</span> on{" "}
                  <span className="text-linen">{receipt.date}</span> is with the atelier. We'll confirm shortly
                  {receipt.whatsapp ? " on WhatsApp" : ""}.
                </p>
                <p className="mt-8 text-[11px] font-mono uppercase tracking-[0.24em] text-taupe">Booking reference</p>
                <p data-testid="booking-reference" className="mt-2 font-mono text-xl text-gold">{receipt.reference}</p>

                {SERVICE_PRICING[receipt.service] && (
                  <div data-testid="deposit-panel" className="mt-8 border border-gold/25 bg-espresso/60 p-6 max-w-md mx-auto text-left">
                    <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-gold">Confirm your chair</p>
                    <p className="mt-3 text-sm text-sand font-light leading-relaxed">
                      A 30% deposit of <span className="text-linen">R{SERVICE_PRICING[receipt.service].deposit}</span> locks
                      your appointment. Balance of R{SERVICE_PRICING[receipt.service].total - SERVICE_PRICING[receipt.service].deposit} on the day.
                    </p>
                    <a
                      data-testid="deposit-whatsapp-button"
                      href={depositWhatsAppUrl(receipt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2.5 bg-gold text-espresso text-[11px] font-mono uppercase tracking-[0.2em] px-6 py-3 hover:bg-gold-hover transition-colors"
                    >
                      <MessageCircle size={14} /> Pay deposit on WhatsApp
                    </a>
                    <p className="mt-3 text-[11px] text-taupe font-light">Kev confirms your slot once the deposit lands.</p>
                  </div>
                )}

                <button
                  data-testid="booking-new-button"
                  onClick={() => { setReceipt(null); setForm(empty); }}
                  className="mt-10 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-sand border border-linen/15 px-6 py-3 hover:border-gold hover:text-gold transition-colors"
                >
                  <RotateCcw size={13} /> Make another enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                data-testid="booking-form"
                onSubmit={submit}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="border border-linen/10 bg-espresso-3/40 p-8 sm:p-12"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="eyebrow !text-[10px] block mb-2.5">Full name *</span>
                    <input data-testid="booking-input-name" required minLength={2} value={form.name} onChange={set("name")} placeholder="Amahle Nkosi" className="field-input" />
                  </label>
                  <label className="block">
                    <span className="eyebrow !text-[10px] block mb-2.5">Phone / WhatsApp *</span>
                    <input data-testid="booking-input-phone" required minLength={6} value={form.phone} onChange={set("phone")} placeholder="+27 82 000 0000" className="field-input" />
                  </label>
                  <label className="block">
                    <span className="eyebrow !text-[10px] block mb-2.5">Email (optional)</span>
                    <input data-testid="booking-input-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="field-input" />
                  </label>
                  <label className="block">
                    <span className="eyebrow !text-[10px] block mb-2.5">Preferred date *</span>
                    <input data-testid="booking-input-date" required type="date" value={form.date} onChange={set("date")} className="field-input" />
                  </label>
                  <label className="block">
                    <span className="eyebrow !text-[10px] block mb-2.5">Service *</span>
                    <select data-testid="booking-select-service" required value={form.service} onChange={set("service")} className="field-input">
                      <option value="" disabled>Choose a service</option>
                      {ALL_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="eyebrow !text-[10px] block mb-2.5">Braid size</span>
                    <select data-testid="booking-select-size" value={form.size} onChange={set("size")} className="field-input">
                      <option value="" disabled>Select size</option>
                      {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="eyebrow !text-[10px] block mb-2.5">Notes — inspiration, house call, sensitivities</span>
                    <textarea data-testid="booking-input-notes" rows={4} value={form.notes} onChange={set("notes")} placeholder="Waist-length knotless, honey brown. House call if possible…" className="field-input resize-none" />
                  </label>
                </div>

                <label className="mt-7 flex items-center gap-3 cursor-pointer w-max">
                  <input data-testid="booking-checkbox-whatsapp" type="checkbox" checked={form.whatsapp} onChange={set("whatsapp")} className="w-4 h-4 accent-[#D4AF37]" />
                  <span className="text-sm text-sand font-light">Confirm my booking on WhatsApp</span>
                </label>

                <button
                  data-testid="booking-submit-button"
                  type="submit"
                  disabled={sending}
                  className="mt-9 w-full sm:w-auto bg-gold text-espresso text-xs font-mono uppercase tracking-[0.24em] px-12 py-4.5 py-4 hover:bg-gold-hover transition-colors duration-300 disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {sending ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : "Send booking enquiry"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
