import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Instagram, MapPin, Clock } from "lucide-react";
import { Reveal } from "./Reveal";
import { FAQS, WHATSAPP_URL } from "../data/content";

const FaqItem = ({ q, a, i }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-linen/10">
      <button
        data-testid={`faq-question-${i + 1}`}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="font-serif text-lg sm:text-xl text-linen group-hover:text-gold transition-colors duration-300">{q}</span>
        <Plus size={17} className={`text-gold shrink-0 transition-transform duration-400 ${open ? "rotate-45" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-7 pr-10 text-sm text-sand font-light leading-relaxed max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AtelierFooter = () => (
  <footer data-testid="site-footer" className="relative border-t border-linen/10 bg-espresso-2/40">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-16">
      <div className="lg:col-span-5">
        <Reveal>
          <h2 className="font-serif font-light text-4xl sm:text-5xl leading-[1.08] text-linen">
            Great hair. <br /><span className="italic text-gold">Great confidence.</span>
          </h2>
          <p className="mt-6 text-sm sm:text-base text-sand font-light leading-relaxed max-w-md">
            Send a message and let's find you a time — in the atelier chair or at your own home.
          </p>
          <a
            data-testid="footer-whatsapp-cta"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-3 bg-gold text-espresso text-xs font-mono uppercase tracking-[0.22em] px-8 py-4 hover:bg-gold-hover transition-colors duration-300"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </Reveal>
      </div>

      <div className="lg:col-span-4">
        <Reveal delay={0.08}>
          <p className="eyebrow mb-6">Questions, answered</p>
          <div data-testid="footer-faq-accordion" className="border-t border-linen/10">
            {FAQS.map((f, i) => <FaqItem key={f.q} q={f.q} a={f.a} i={i} />)}
          </div>
        </Reveal>
      </div>

      <div className="lg:col-span-3">
        <Reveal delay={0.16}>
          <p className="eyebrow mb-6">The Atelier</p>
          <div data-testid="footer-location-info" className="space-y-5 text-sm text-sand font-light">
            <p className="flex items-start gap-3"><MapPin size={15} className="text-gold mt-0.5 shrink-0" /> Based in Buccleuch, Sandton<br />House calls across the area</p>
            <p className="flex items-start gap-3"><Clock size={15} className="text-gold mt-0.5 shrink-0" /> Tue – Sat · 09:00 – 18:00<br />House calls by arrangement</p>
            <a
              data-testid="footer-instagram-link"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-gold transition-colors duration-300"
            >
              <Instagram size={15} className="text-gold" /> @hairbykev
            </a>
          </div>
        </Reveal>
      </div>
    </div>

    <div className="border-t border-linen/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-serif text-lg text-linen">Hair <span className="italic text-gold">By</span> Kev</p>
        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-taupe">
          © {new Date().getFullYear()} — Braiding artistry for women · Buccleuch, Sandton
        </p>
      </div>
    </div>
  </footer>
);
