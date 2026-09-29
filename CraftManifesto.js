import { Reveal, SectionHeading } from "./Reveal";
import { CHAPTERS } from "../data/content";

export const CraftManifesto = () => (
  <section id="manifesto" data-testid="manifesto-section" className="relative py-28 lg:py-36">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-16">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <SectionHeading
            eyebrow="The Manifesto"
            title={<>Braiding is not a service. <span className="italic text-gold">It is a craft.</span></>}
            copy="Four principles govern every chair session at the atelier. They are non-negotiable, and they are why our clients' edges thrive."
          />
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col">
        {CHAPTERS.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.06}>
            <div
              data-testid={`manifesto-chapter-${i + 1}`}
              className="group grid sm:grid-cols-[110px_1fr] gap-4 sm:gap-8 py-10 border-t border-linen/10 last:border-b hover:bg-espresso-2/40 transition-colors duration-500 px-2 sm:px-4"
            >
              <span className="font-serif text-4xl sm:text-5xl text-gold/40 group-hover:text-gold transition-colors duration-500">
                {c.n}
              </span>
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-linen">{c.title}</h3>
                <p className="mt-4 text-sm sm:text-base text-sand font-light leading-relaxed max-w-xl">{c.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
