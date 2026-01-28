import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { TopRated } from "../assets/data";
import { HighligthData } from "./highligthdata";
import { useInView } from "../hooks/useInView";

const badges = ["Free delivery", "Zero deposit", "Instant approval"];

export const Highligth = () => {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });
  const [isDragging] = useState(false);
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="mt-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-12 text-slate-800"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div
          className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <h3 className="mt-3 text-3xl font-bold md:text-4xl text-slate-900">
              Top cars rented this month
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
              Curated from thousands of successful trips. These trims balance
              comfort, performance, and concierge scores. Swipe on mobile—line
              up horizontally on desktop—for an instant shortlist.
            </p>
          </div>
          <div
            className={`flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-500 ${
              isInView ? "stagger-children" : "opacity-0"
            }`}
          >
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-slate-200 px-4 py-2 bg-white"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 hover-glow transition-all duration-700 delay-100 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div ref={emblaRef} className="overflow-hidden py-4">
            <div
              className={`flex gap-6 [will-change:transform] ${
                isDragging ? "cursor-grabbing select-none" : "cursor-grab"
              }`}
            >
              {TopRated.map((data, id) => (
                <div
                  key={data?.id ?? id}
                  className="w-72 flex-shrink-0 lg:w-full lg:flex-1 lg:basis-0"
                >
                  <HighligthData data={data} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
