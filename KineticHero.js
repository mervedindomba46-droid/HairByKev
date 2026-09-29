import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkle, ArrowDown } from "lucide-react";

const LINES = [
  { text: "Your crown,", italic: false },
  { text: "hand-woven", italic: true },
  { text: "to perfection.", italic: false },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
};
const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
};
const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -60, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const KineticHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const frameY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section id="top" ref={ref} data-testid="hero-section" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.07),transparent_55%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-14 lg:gap-8 items-center w-full">
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-7">
          <motion.p variants={fade} className="eyebrow mb-8 flex items-center gap-3">
            <Sparkle size={13} strokeWidth={1.5} /> Hair By Kev — Buccleuch, Sandton
          </motion.p>

          <h1 data-testid="hero-headline" className="font-serif font-light tracking-tight leading-[1.02] text-5xl sm:text-7xl lg:text-[5.4rem] text-linen">
            {LINES.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span variants={line} className={`block ${l.italic ? "italic text-gold" : ""}`}>
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={fade}
            data-testid="hero-subtitle"
            className="mt-8 max-w-xl text-base sm:text-lg text-sand font-light leading-relaxed"
          >
            Knotless, goddess braids, straight backs, french curls and more — tension-free artistry at the
            Buccleuch studio, or brought to your door anywhere in Sandton.
          </motion.p>

          <motion.div variants={fade} className="mt-10 flex flex-wrap items-center gap-5">
            <button
              data-testid="hero-cta-book"
              onClick={() => scrollTo("booking")}
              className="group bg-gold text-espresso text-xs font-mono uppercase tracking-[0.22em] px-9 py-4 hover:bg-gold-hover transition-colors duration-400"
            >
              Reserve your chair
            </button>
            <button
              data-testid="hero-cta-gallery"
              onClick={() => scrollTo("gallery")}
              className="group flex items-center gap-3 text-xs font-mono uppercase tracking-[0.22em] text-sand hover:text-gold transition-colors duration-300"
            >
              View the gallery
              <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </motion.div>

          <motion.div variants={fade} className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
            {[
              ["2,400+", "crowns woven"],
              ["6–8 wks", "style longevity"],
              ["Zero", "tension installs"],
            ].map(([v, k]) => (
              <div key={k}>
                <p className="font-serif text-3xl text-linen">{v}</p>
                <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-taupe">{k}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative"
        >
          <motion.div style={{ y: frameY }} className="absolute -inset-4 border border-gold/30 translate-x-5 translate-y-5 pointer-events-none" />
          <motion.div style={{ y: imgY }} className="relative overflow-hidden gold-frame">
            <img
              src="/images/hero.jpg"
              alt="Regal braided profile portrait"
              data-testid="hero-image"
              className="w-full h-[420px] sm:h-[540px] lg:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            data-testid="hero-badge-experience"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 sm:-left-10 bottom-14 bg-espresso-2/85 backdrop-blur-md border border-linen/10 px-5 py-4"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-gold">Tension-Free</p>
            <p className="mt-1 font-serif text-lg text-linen">Certified Artistry</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
