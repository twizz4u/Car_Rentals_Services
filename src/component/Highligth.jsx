import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { TopRated } from "../assets/data";
import { HighligthData } from "./Highligthdata";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Highligth = () => {
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

  const topCars = TopRated || [];

  return (
    <section id="highlights" className="py-24 sm:py-32 bg-[#05070c] border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-medium tracking-[0.22em] text-amber-500 uppercase mb-5">
              Monthly Highlights
            </div>
            <h2 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-normal text-[#f5f3ee] tracking-[-0.03em] leading-[1.02]">
              Top rented this month.
            </h2>
            <p className="mt-6 text-base text-slate-300 max-w-lg font-light leading-7">
              Our most requested vehicles, ready for your next journey.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous highlight vehicle"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/[0.14] text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next highlight vehicle"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/[0.14] text-slate-300 transition-colors hover:border-amber-500 hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Vehicle Carousel */}
        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 sm:gap-7 lg:gap-8 pb-2 cursor-grab active:cursor-grabbing">
            {topCars.map((data, id) => (
              <div
                key={`${data?.name ?? "top"}-${id}`}
                className="w-[300px] sm:w-[340px] lg:w-[360px] flex-shrink-0"
              >
                <HighligthData data={data} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Also export as Highlights for flexibility
export const Highlights = Highligth;
export default Highligth;
