const ITEMS = [
  "Knotless Artistry",
  "Scalp Preservation",
  "Tailored Lengths",
  "Heritage Technique",
  "Botanical Rituals",
  "Zero Tension",
];

export const EditorialMarquee = () => (
  <div data-testid="editorial-marquee-strip" className="relative py-8 border-y border-linen/5 overflow-hidden bg-espresso-2/40">
    <div className="flex w-max animate-marquee">
      {[0, 1].map((dup) => (
        <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
          {ITEMS.map((item) => (
            <span key={`${dup}-${item}`} className="flex items-center">
              <span className="font-serif italic font-light text-2xl sm:text-3xl text-linen/25 whitespace-nowrap px-8">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rotate-45 bg-gold/40 shrink-0" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
