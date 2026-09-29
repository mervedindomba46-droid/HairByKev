import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data/content";

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const AtelierHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-espresso-2/75 backdrop-blur-md border-b border-linen/5 py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        <button
          data-testid="nav-logo"
          onClick={() => scrollTo("top")}
          className="flex items-baseline gap-2 group"
        >
          <span className="font-serif text-2xl tracking-tight text-linen">
            Hair <span className="italic text-gold">By</span> Kev
          </span>
          <span className="hidden sm:block w-8 h-px bg-gold/50 group-hover:w-12 transition-all duration-500" />
        </button>

        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={l.testid}
              onClick={() => scrollTo(l.id)}
              className="relative text-xs font-mono uppercase tracking-[0.22em] text-sand hover:text-linen transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold hover:after:w-full after:transition-all after:duration-500"
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-cta-booking"
            onClick={() => scrollTo("booking")}
            className="ml-2 border border-gold/60 text-gold text-xs font-mono uppercase tracking-[0.22em] px-6 py-3 hover:bg-gold hover:text-espresso transition-colors duration-400"
          >
            Reserve
          </button>
        </nav>

        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden text-linen"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="nav-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-espresso-2/95 backdrop-blur-md border-b border-linen/5"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  data-testid={`nav-mobile-${l.id}`}
                  onClick={() => { setOpen(false); scrollTo(l.id); }}
                  className="text-left text-sm font-mono uppercase tracking-[0.22em] text-sand"
                >
                  {l.label}
                </button>
              ))}
              <button
                data-testid="nav-mobile-cta-booking"
                onClick={() => { setOpen(false); scrollTo("booking"); }}
                className="mt-2 border border-gold/60 text-gold text-xs font-mono uppercase tracking-[0.22em] px-6 py-3 w-max"
              >
                Reserve
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
