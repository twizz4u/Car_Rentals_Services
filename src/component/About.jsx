import { useInView } from "../hooks/useInView";

const highlights = [
  "Premium sedans, SUVs, and EVs across 28 cities",
  "Concierge delivery in under 45 minutes",
  "Flexible loan terms with transparent pricing",
  "24/7 mechanic and roadside support",
];

const randomImage =
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80";

export const About = () => {
  const [ref, isInView] = useInView({ threshold: 0.15 });

  return (
    <section ref={ref} className="mt-20 px-6" aria-labelledby="about-heading">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-100 bg-white shadow-[0_25px_65px_rgba(15,23,42,0.08)] hover-glow">
        <div className="flex flex-col gap-8 p-6 lg:flex-row lg:items-center">
          <div
            className={`flex-1 space-y-4 transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-700">
              Our story
            </p>
            <h3
              id="about-heading"
              className="text-3xl font-bold text-slate-900 md:text-4xl"
            >
              About Tasin Car Loans
            </h3>
            <p className="text-sm text-slate-600 md:text-base">
              Tasin Car links discerning travelers with meticulously serviced
              rides. From black-tie evenings to cross-country escapes, we tailor
              luxury on loan so every journey feels personal. Expect concierge
              check-ins, curated add-ons, and pricing that keeps surprises off
              the invoice.
            </p>

            <ul
              className={`grid gap-4 sm:grid-cols-2 ${isInView ? "stagger-children" : "opacity-0"}`}
            >
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-700"
                >
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`flex-1 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <div className="relative h-[360px] w-full overflow-hidden rounded-[28px] border border-slate-100 bg-slate-200 shadow-2xl group">
              <img
                src={randomImage}
                alt="Luxury car ready for loan"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-800 shadow backdrop-blur-sm">
                15 years redefining rentals
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
