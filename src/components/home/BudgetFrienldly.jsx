import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { BudgetFriendly as BudgetFriendlyData } from "../../assets/data";
import { BudgetDetails } from "./BudgetFriendlydetails";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BudgetFriendly = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const featuredCards = BudgetFriendlyData || [];

  return (
    <section id="accessible-fleet" className="py-24 sm:py-32 bg-[#000000] border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-medium tracking-[0.22em] text-amber-500 uppercase mb-4">
              Accessible Fleet
            </div>
            <h2 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f5f3ee] tracking-[-0.03em] leading-[1.02]">
              Effortless daily rates.
            </h2>
            <p className="mt-5 text-base text-slate-300 max-w-xl font-light leading-7">
              Premium compact executive sedans and crossovers tailored for smart city
              itineraries without cutting corners on comfort or vehicle preparation.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous vehicle"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/[0.14] text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next vehicle"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/[0.14] text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Vehicle Carousel */}
        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 sm:gap-7 lg:gap-8 pb-2 cursor-grab active:cursor-grabbing">
            {featuredCards.map((data, id) => (
              <div
                key={`${data?.name ?? "budget"}-${id}`}
                className="w-[300px] sm:w-[340px] lg:w-[360px] flex-shrink-0"
              >
                <BudgetDetails data={data} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetFriendly;
