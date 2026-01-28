import { BudgetFriendly as BudgetFriendlyData } from "../assets/data";
import { BudgetDetails } from "./budgetFriendlydetails";
import { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const perks = ["Flexible deposits", "Fuel-efficient picks", "24/7 roadside"];

export const BudgetFriendly = () => {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true });
  const [isDragging] = useState(false);
  const featuredCards = BudgetFriendlyData.slice(0, 5);

  return (
    <section className="mt-24 px-4 py-12">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-100 bg-white shadow-[0_35px_75px_rgba(15,23,42,0.08)]">
        <div className="space-y-10 p-6">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              Budget picks
            </p>
            <h3 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Wallet-friendly cars that still feel premium
            </h3>
            <p className="mt-3 text-sm text-slate-500 md:text-base">
              These trims keep monthly payments predictable without cutting
              corners on comfort. Browse compact SUVs, efficient sedans, and
              hybrids ready for same-day delivery.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              {perks.map((perk) => (
                <span
                  key={perk}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  {perk}
                </span>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wide text-slate-500">
                <span>Featured budget cars</span>
                <span className="sm:hidden">Swipe to view all 5</span>
              </div>
              <div
                ref={emblaRef}
                className="overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <div
                  className={`mt-4 flex gap-5 pb-4 pt-2   ${
                    isDragging ? "cursor-grabbing select-none" : "cursor-grab"
                  }`}
                >
                  {featuredCards.map((data, id) => (
                    <div
                      key={`${data?.name ?? "budget"}-${id}`}
                      className=" min-w-[220px] max-w-[260px] flex-shrink-0 md:flex-shrink-1 rounded-3xl bg-white p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-emerald-200"
                    >
                      <BudgetDetails data={data} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
