import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const featuredCars = [
  {
    name: "Mercedes-Benz S-Class S580",
    image: `${import.meta.env.BASE_URL}cars/hero_mercedes_s580.jpg`,
  },
  {
    name: "Range Rover Autobiography",
    image: `${import.meta.env.BASE_URL}cars/range_rover_autobiography.jpg`,
  },
  {
    name: "Mercedes-AMG G 63 V8",
    image: `${import.meta.env.BASE_URL}cars/mercedes-g-class.jpg`,
  },
  {
    name: "Lexus LX 600 VIP",
    image: `${import.meta.env.BASE_URL}cars/lexus_lx600.jpg`,
  },
  {
    name: "Porsche Panamera GTS",
    image: `${import.meta.env.BASE_URL}cars/porsche-panamera.jpg`,
  },
];

const transitionStyles = ["wipe", "iris", "blade", "parallax", "bloom"];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback(
    (newIndex) => {
      if (newIndex === currentIndex) return;
      setPrevIndex(currentIndex);
      setCurrentIndex(newIndex);
      setAnimKey((k) => k + 1);
    },
    [currentIndex],
  );

  const handleNext = useCallback(() => {
    const next = (currentIndex + 1) % featuredCars.length;
    goToSlide(next);
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    const prev = (currentIndex - 1 + featuredCars.length) % featuredCars.length;
    goToSlide(prev);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [handleNext, isPaused]);

  // Rotate through 5 bespoke animation styles
  const currentStyle = transitionStyles[currentIndex % transitionStyles.length];

  const inAnimations = {
    wipe: "styleWipeIn 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
    iris: "styleIrisIn 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
    blade: "styleBladeIn 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
    parallax: "styleParallaxIn 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
    bloom: "styleBloomIn 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
  };

  const outAnimations = {
    wipe: "styleWipeOut 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
    iris: "styleIrisOut 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
    blade: "styleBladeOut 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
    parallax: "styleParallaxOut 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
    bloom: "styleBloomOut 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
  };

  return (
    <section className="relative overflow-hidden bg-black pb-12 pt-6 sm:pb-16 sm:pt-10 lg:pt-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-12">
        {/* Left Column: Text Section */}
        <div className="flex flex-col justify-between lg:col-span-6">
          <div>
            <h1
              className="animate-fade-in-up max-w-xl font-['Playfair_Display',serif] text-5xl font-normal leading-[1.04] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "120ms" }}
            >
              <span className="block text-[#f5f3ee]">
                The new standard of luxury
              </span>
              <span className="block font-light text-slate-400 mt-1 sm:mt-2">
                on Lagos roads.
              </span>
            </h1>
            <p
              className="animate-fade-in-up mt-6 max-w-lg text-base font-light leading-relaxed text-slate-300 sm:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              Explore our verified collection of luxury sedans, executive SUVs,
              and premium cars in Lagos. Whether you need a professional driver
              for business or a clean self-drive vehicle delivered to your door,
              book easily with transparent daily rates and guaranteed vehicle
              condition.
            </p>
            <div
              className="animate-fade-in-up mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
              style={{ animationDelay: "360ms" }}
            >
              <a
                href="#fleet"
                className="inline-flex items-center gap-2 bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
              >
                Find a Vehicle <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:+2348008274666"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition-colors hover:text-white"
              >
                Talk to Our Team
              </a>
            </div>
          </div>

          <div
            className="animate-fade-in-up mt-9 pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-6"
            style={{ animationDelay: "420ms" }}
          >
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-[#f5f3ee] tracking-tight">
                Drivers &amp; Security on Request
              </h4>
              <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
                Professional personal drivers and discreet security escort
                support available for any journey.
              </p>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-[#f5f3ee] tracking-tight">
                Exact Vehicle Guarantee
              </h4>
              <p className="text-xs text-slate-400 font-light mt-1 leading-relaxed">
                You receive the exact vehicle you booked, fully cleaned, fueled,
                and delivered on time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Style Vehicle Showcase */}
        <div className="lg:col-span-6 flex items-start justify-center lg:justify-end">
          <figure
            className="group relative w-full max-w-[560px] overflow-hidden rounded-[2px] border border-white/[0.09] bg-[#07080b] shadow-[0_16px_48px_-10px_rgba(0,0,0,0.85)]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Visual Screen Frame — cinematic 3:2 automotive ratio */}
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#050608]">
              {/* Studio ambient radial highlight */}
              <div
                className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.06)_0%,_transparent_70%)]"
                aria-hidden="true"
              />

              {/* Cinematic Vignette */}
              <div
                className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-black/25"
                aria-hidden="true"
              />

              {/* Animated Slides with alternating styles */}
              {featuredCars.map((car, idx) => {
                const isCurrent = idx === currentIndex;
                const isPrev = idx === prevIndex;

                if (!isCurrent && !isPrev) return null;

                return (
                  <div
                    key={car.name}
                    className={`absolute inset-0 overflow-hidden ${
                      isCurrent ? "z-20" : "z-10"
                    }`}
                    style={
                      prevIndex !== null && isCurrent
                        ? {
                            animation: inAnimations[currentStyle],
                            willChange: "clip-path, transform, filter",
                          }
                        : prevIndex !== null && isPrev
                          ? {
                              animation: outAnimations[currentStyle],
                              willChange: "opacity, transform, filter",
                            }
                          : {}
                    }
                  >
                    <img
                      src={car.image}
                      alt={`${car.name} available to rent`}
                      className={`h-full w-full object-cover object-center brightness-[0.93] contrast-[1.04] select-none transition-transform duration-[6000ms] ease-out ${
                        isCurrent ? "scale-105" : "scale-100"
                      }`}
                    />
                  </div>
                );
              })}

              {/* Style-Specific Optical Lighting Effects */}
              {prevIndex !== null && currentStyle === "wipe" && (
                <div
                  key={`flare-wipe-${animKey}`}
                  className="pointer-events-none absolute inset-y-0 z-30 w-28 bg-gradient-to-r from-transparent via-amber-400/40 via-white/50 to-transparent blur-md"
                  style={{
                    animation:
                      "flareSweepH 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  }}
                  aria-hidden="true"
                />
              )}
              {prevIndex !== null && currentStyle === "iris" && (
                <div
                  key={`flare-iris-${animKey}`}
                  className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div
                    className="h-64 w-64 rounded-full border border-amber-400/50 bg-amber-400/10 blur-md"
                    style={{
                      animation:
                        "flareIrisRing 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    }}
                  />
                </div>
              )}
              {prevIndex !== null && currentStyle === "blade" && (
                <div
                  key={`flare-blade-${animKey}`}
                  className="pointer-events-none absolute inset-x-0 z-30 h-16 bg-gradient-to-b from-transparent via-amber-400/40 via-white/50 to-transparent blur-md"
                  style={{
                    animation:
                      "flareSweepV 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  }}
                  aria-hidden="true"
                />
              )}
              {prevIndex !== null && currentStyle === "bloom" && (
                <div
                  key={`flare-bloom-${animKey}`}
                  className="pointer-events-none absolute inset-0 z-30 bg-amber-400/20 blur-xl"
                  style={{
                    animation:
                      "flareBloomPulse 950ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Interactive Navigation Triggers (Subtle on hover) */}
              <div className="absolute inset-y-0 left-3 z-30 flex items-center">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous vehicle"
                  className="h-9 w-9 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-slate-300 opacity-0 group-hover:opacity-100 hover:border-amber-500/80 hover:text-amber-400 hover:bg-black/90 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xl active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-3 z-30 flex items-center">
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next vehicle"
                  className="h-9 w-9 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-slate-300 opacity-0 group-hover:opacity-100 hover:border-amber-500/80 hover:text-amber-400 hover:bg-black/90 transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xl active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Hairline Timeline Progress Beam */}
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/[0.08] z-30 overflow-hidden">
                <div
                  key={`prog-${animKey}-${isPaused}`}
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200"
                  style={{
                    animation: isPaused
                      ? "none"
                      : "heroProgress 5000ms linear forwards",
                    width: isPaused ? "100%" : "0%",
                  }}
                />
              </div>
            </div>

            {/* Kinetic Caption Typography */}
            <figcaption className="flex flex-col gap-1 border-t border-white/[0.07] bg-[#08090d] px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="overflow-hidden h-6 flex items-center">
                <div
                  key={`title-${currentIndex}`}
                  className="flex items-center gap-2.5 font-medium text-[#f5f3ee]"
                  style={{
                    animation:
                      "heroKineticUp 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  }}
                >
                  <span className="font-mono text-xs font-semibold text-amber-500 tracking-wider">
                    0{currentIndex + 1}
                  </span>
                  <span className="h-3 w-[1px] bg-white/20" />
                  <span>{featuredCars[currentIndex].name}</span>
                </div>
              </div>
              <div className="overflow-hidden h-5 flex items-center">
                <span
                  key={`sub-${currentIndex}`}
                  className="font-light text-slate-400 text-xs sm:text-sm"
                  style={{
                    animation:
                      "heroKineticUp 600ms cubic-bezier(0.16, 1, 0.3, 1) 50ms forwards",
                  }}
                >
                  Available for rental · Lagos
                </span>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Hero;
