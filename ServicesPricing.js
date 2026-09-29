import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { SERVICES, SERVICE_TABS } from "../data/content";

export const ServicesPricing = ({ onSelectService }) => {
  const [tab, setTab] = useState("braids");

  return (
    <section id="services" data-testid="services-section" className="relative py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeading
          eyebrow="Services & Investment"
          title={<>A menu built around <span className="italic text-gold">your hair.</span></>}
          copy="Premium fibre is included in every install. Final quotes are confirmed before your appointment — no surprises at the chair."
        />

        <Reveal delay={0.15} className="mt-14 flex flex-wrap gap-2">
          {SERVICE_TABS.map((t) => (
            <button
              key={t.id}
              data-testid={t.testid}
              onClick={() => setTab(t.id)}
              className={`text-[11px] font-mono uppercase tracking-[0.2em] px-6 py-3 border transition-colors duration-300 ${
                tab === t.id
                  ? "border-gold bg-gold text-espresso"
                  : "border-linen/15 text-sand hover:border-gold/50 hover:text-linen"
              }`}
            >
              {t.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-4 border-t border-linen/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {SERVICES[tab].map((s, i) => (
                <div
                  key={s.name}
                  data-testid={`service-row-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="group grid sm:grid-cols-[1fr_auto_auto_auto] items-center gap-3 sm:gap-10 py-7 border-b border-linen/10 hover:bg-espresso-2/40 transition-colors duration-400 px-2 sm:px-4"
                >
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-linen flex items-baseline gap-3">
                      <span className="text-xs font-mono text-gold/60">{String(i + 1).padStart(2, "0")}</span>
                      {s.name}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-taupe font-light">{s.detail}</p>
                  </div>
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-sand">{s.duration}</p>
                  <p className="font-serif text-xl text-gold sm:text-right">{s.price}</p>
                  <button
                    data-testid={`service-select-btn-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    onClick={() => onSelectService(s.name)}
                    className="justify-self-start sm:justify-self-end flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-sand border border-linen/15 px-5 py-2.5 hover:border-gold hover:text-gold transition-colors duration-300"
                  >
                    Select <ArrowUpRight size={13} />
                  </button>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
