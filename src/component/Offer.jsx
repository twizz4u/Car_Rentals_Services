import { useInView } from "../hooks/useInView";

const highlights = [
  {
    title: "Certified Fleet",
    description:
      "Meticulously serviced sedans, SUVs, and vans ready for long or short trips.",
  },
  {
    title: "Flexible Plans",
    description:
      "Pick daily, weekly, or custom loan periods that match your itinerary and budget.",
  },
  {
    title: "Concierge Support",
    description:
      "24/7 customer desk that coordinates roadside help, swaps, and add-ons.",
  },
  {
    title: "Transparent Pricing",
    description:
      "No surprise fees—see insurance, mileage, and deposits before you book.",
  },
  {
    title: "Comfort First",
    description:
      "Premium interiors, climate control, and infotainment to keep every ride smooth.",
  },
];

const stats = [
  { label: "Cars Delivered", value: "3.4k+" },
  { label: "Avg. Rating", value: "4.9/5" },
  { label: "Cities Served", value: "28" },
];

export const Offer = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="relative mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-6 py-12 shadow-xl"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <p className="mb-3 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Why choose us
          </p>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Loan a car that feels brand new every single time
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            We obsess over details—from preventative maintenance to concierge
            support—so you only have to think about the road ahead. Compare
            trims, lock in pricing, and pick up with zero paperwork delays.
          </p>
          <ul
            className={`mt-6 space-y-4 ${
              isInView ? "stagger-children" : "opacity-0"
            }`}
          >
            {highlights.map((item) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-2xl border border-indigo-100 bg-white/60 px-4 py-3 shadow-sm backdrop-blur"
              >
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-700">
                  ✓
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`relative rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur transition-all duration-700 delay-200 ${
            isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-700 p-1">
            <div className="flex h-full flex-col justify-between rounded-[18px] bg-slate-900/70 p-6 text-white">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-indigo-200">
                  Featured SUV
                </p>
                <p className="text-3xl font-bold">Apex X7 2024</p>
                <p className="mt-2 text-sm text-slate-200">
                  Adaptive cruise, ventilated seats, and a premium JBL sound
                  system ready for your next escape.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Range</p>
                  <p className="text-lg font-semibold text-white">610 km</p>
                </div>
                <div>
                  <p className="text-slate-400">Delivery</p>
                  <p className="text-lg font-semibold text-white">Under 45m</p>
                </div>
                <div>
                  <p className="text-slate-400">Insurance</p>
                  <p className="text-lg font-semibold text-white">Included</p>
                </div>
                <div>
                  <p className="text-slate-400">Swap</p>
                  <p className="text-lg font-semibold text-white">Anytime</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`mt-6 grid grid-cols-3 gap-4 ${
              isInView ? "stagger-children" : "opacity-0"
            }`}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-center transition-all hover:scale-105 hover:shadow-md"
              >
                <p className="text-xl font-bold text-indigo-900">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wide text-indigo-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
