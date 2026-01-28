import { CustomerCardReviews } from "./CustomerReviewCard";
import { useInView } from "../hooks/useInView";

const reviewStats = [
  { label: "Avg. rating", value: "4.9/5" },
  { label: "Trips completed", value: "12k+" },
  { label: "Response time", value: "< 2h" },
];

export const CustomerReviews = () => {
  const [ref, isInView] = useInView({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="mt-24 px-4"
      aria-labelledby="customer-reviews-heading"
    >
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-100 bg-white shadow-[0_25px_65px_rgba(15,23,42,0.08)] hover-glow">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.05fr_1fr]">
          <div
            className={`transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
              Real riders
            </p>
            <h3
              id="customer-reviews-heading"
              className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl"
            >
              Customers keep coming back
            </h3>
            <p className="mt-3 text-sm text-slate-500 md:text-base">
              Every booking is paired with concierge check-ins, transparent
              billing, and well-serviced vehicles. Hear how Tasin keeps trips
              worry-free from pick-up to drop-off.
            </p>

            <dl
              className={`mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 ${isInView ? "stagger-children" : "opacity-0"}`}
            >
              {reviewStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-indigo-100 bg-indigo-50/50 px-4 py-3 text-center transition-all hover:scale-105 hover:shadow-md"
                >
                  <dt className="text-xs uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </dt>
                  <dd className="text-2xl font-bold text-indigo-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
          >
            <CustomerCardReviews />
          </div>
        </div>
      </div>
    </section>
  );
};
