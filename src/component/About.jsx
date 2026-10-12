import { useInView } from "../hooks/useInView";
import { Check } from "lucide-react";

export const highlights = [
  "Premium sedans, SUVs, and EVs across Lagos & Abuja",
  "Concierge airport delivery directly to terminal",
  "Transparent reservation rates with zero surprise fees",
  "24/7 dedicated support & rapid vehicle dispatch",
];

const brandImage = "/cars/hero_mercedes_s580.jpg";

export const About = () => {
  const [ref, isInView] = useInView({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="our-story"
      className="py-24 sm:py-32 bg-[#000000] border-t border-white/[0.08]"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <div
            className={`flex-1 space-y-6 transition-all duration-700 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="text-[11px] font-medium tracking-[0.22em] text-amber-500 uppercase">
              Our Story
            </div>
            <h2
              id="about-heading"
              className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f5f3ee] tracking-[-0.03em] leading-[1.02]"
            >
              Mobility, curated for distinction.
            </h2>
            <p className="text-base text-slate-300 font-light leading-relaxed">
              TASIN MOBILITY links corporate executives, diplomats, and discerning travelers
              with impeccably prepared vehicles. From high-stakes boardroom arrivals to private
              evening engagements, our chauffeur and self-drive fleet guarantees discretion,
              punctuality, and refined automotive pedigree.
            </p>

            <ul className="grid gap-3.5 sm:grid-cols-2 pt-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs sm:text-sm text-slate-300"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`flex-1 transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/[0.1] bg-[#07080a] group">
              <img
                src={brandImage}
                alt="Luxury vehicle fleet"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 brightness-[0.93]"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 border border-white/[0.14] bg-black/70 backdrop-blur-md px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#f5f3ee]">
                Executive Fleet Standards
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
