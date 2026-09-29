import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, Clock, CalendarCheck, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { GALLERY } from "../data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const FILTERS = ["All", "Knotless", "Cornrows", "Goddess", "Updos", "Sew In", "Hair Treatment"];

export const StyleGallery = ({ onBookStyle }) => {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    axios
      .get(`${API}/photos`)
      .then((res) =>
        setPhotos(
          res.data.map((p) => ({
            id: `up-${p.id}`,
            title: p.title,
            category: p.category,
            service: p.service || null,
            duration: null,
            price: null,
            longevity: null,
            img: `${API}/files/${p.path}`,
            alt: p.title,
            desc: p.description || "",
          }))
        )
      )
      .catch(() => {});
    axios
      .get(`${API}/photos/overrides`)
      .then((res) => {
        const m = {};
        res.data.forEach((o) => {
          m[o.gallery_id] = `${API}/files/${o.path}`;
        });
        setOverrides(m);
      })
      .catch(() => {});
  }, []);

  const items = useMemo(() => {
    const base = GALLERY.map((g) => (overrides[g.id] ? { ...g, img: overrides[g.id] } : g));
    const all = [...photos, ...base];
    return filter === "All" ? all : all.filter((g) => g.category === filter);
  }, [filter, photos, overrides]);

  return (
    <section id="gallery" data-testid="gallery-section" className="relative py-28 lg:py-36 bg-espresso-2/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <SectionHeading
            eyebrow="The Gallery"
            title={<>Recent work from <span className="italic text-gold">the chair.</span></>}
            copy="Every style built to last — clean parts, balanced weight, edges intact."
          />
          <Reveal delay={0.1} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                data-testid={`gallery-filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setFilter(f)}
                className={`text-[11px] font-mono uppercase tracking-[0.2em] px-5 py-2.5 border transition-colors duration-300 ${
                  filter === f
                    ? "border-gold bg-gold text-espresso"
                    : "border-linen/15 text-sand hover:border-gold/50 hover:text-linen"
                }`}
              >
                {f}
              </button>
            ))}
          </Reveal>
        </div>

        <motion.div layout className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => (
              <motion.button
                layout
                key={g.id}
                data-testid={`gallery-card-${g.id}`}
                onClick={() => setActive(g)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="spotlight-card group relative text-left overflow-hidden border border-linen/10 bg-espresso-3"
              >
                <div className="overflow-hidden">
                  <img
                    src={g.img}
                    alt={g.alt}
                    loading="lazy"
                    className="w-full h-80 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-gold">{g.category}</p>
                    <h3 className="mt-2 font-serif text-xl text-linen">{g.title}</h3>
                    {g.price && <p className="mt-1 text-xs text-taupe font-light">{g.price}</p>}
                  </div>
                  <ArrowRight size={16} className="mt-2 text-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400 shrink-0" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {items.length === 0 && (
          <div data-testid="gallery-empty-state" className="mt-16 border border-linen/10 bg-espresso-3/30 p-12 text-center">
            <p className="font-serif text-2xl text-linen">Photos coming soon</p>
            <p className="mt-3 text-sm text-sand font-light">
              Fresh {filter} work is being added to the gallery — check back shortly or book a consultation.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            data-testid="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8 bg-espresso/85 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl w-full grid md:grid-cols-2 bg-espresso-2 border border-linen/10 gold-frame overflow-hidden max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                data-testid="gallery-modal-close"
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-espresso/70 backdrop-blur border border-linen/15 text-linen hover:text-gold hover:border-gold/50 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <img src={active.img} alt={active.alt} className="w-full h-64 md:h-full object-cover" />
              <div className="p-8 sm:p-10 flex flex-col justify-center overflow-y-auto">
                <p className="eyebrow">{active.category}</p>
                <h3 className="mt-3 font-serif text-3xl text-linen">{active.title}</h3>
                <p className="mt-5 text-sm text-sand font-light leading-relaxed">{active.desc}</p>
                {(active.duration || active.longevity) && (
                  <div className="mt-8 grid grid-cols-2 gap-5 text-sm">
                    {active.duration && (
                      <div className="border border-linen/10 p-4">
                        <Clock size={15} className="text-gold" />
                        <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">Duration</p>
                        <p className="mt-1 text-linen">{active.duration}</p>
                      </div>
                    )}
                    {active.longevity && (
                      <div className="border border-linen/10 p-4">
                        <CalendarCheck size={15} className="text-gold" />
                        <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">Holds for</p>
                        <p className="mt-1 text-linen">{active.longevity}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
                  {active.price && <p className="font-serif text-2xl text-gold">{active.price}</p>}
                  <button
                    data-testid="gallery-modal-book"
                    onClick={() => { onBookStyle(active.service || active.title); setActive(null); }}
                    className="bg-gold text-espresso text-[11px] font-mono uppercase tracking-[0.22em] px-7 py-3.5 hover:bg-gold-hover transition-colors"
                  >
                    Book this style
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
