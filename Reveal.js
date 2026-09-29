import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 36 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ eyebrow, title, copy, align = "left" }) => (
  <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
    <Reveal>
      <p className="eyebrow mb-5">{eyebrow}</p>
    </Reveal>
    <Reveal delay={0.08}>
      <h2 className="font-serif font-light tracking-tight text-3xl sm:text-5xl leading-[1.08] text-linen">{title}</h2>
    </Reveal>
    {copy && (
      <Reveal delay={0.16}>
        <p className="mt-6 text-base text-sand font-light leading-relaxed">{copy}</p>
      </Reveal>
    )}
  </div>
);
