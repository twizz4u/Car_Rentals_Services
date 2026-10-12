import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../component/Header";
import { Footer } from "../component/Footer";
import { Cart } from "../component/Cart";
import {
  CarDetail,
  formatVehicleTitle,
  resolveAsset,
} from "../component/CarDetails";
import { useCart } from "../context/CartContext";
import { useInView } from "../hooks/useInView";
import { data as localFleet } from "../assets/data";
import {
  getRelatedVehicles,
  resolveAvailability,
  resolveDescription,
  resolveExperienceImages,
  resolveFeatures,
  resolveGalleryImages,
  resolveIdentity,
  resolvePrice,
  resolveRentalConditions,
  resolveRentalTerms,
  resolveSpecs,
} from "../assets/carDetailsData";
import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Gauge,
  KeyRound,
  Maximize2,
  Music,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Sun,
  X,
} from "lucide-react";

// Decorative icon hints for the feature labels supplied by the vehicle record.
// Purely presentational — no feature is ever invented on the frontend.
const FEATURE_ICONS = [
  { match: /leather|upholster|nappa|alcantara|trim/i, icon: Armchair },
  { match: /climate|air ?con|air conditioning|ventilat/i, icon: Snowflake },
  { match: /carplay|android auto|infotainment|bluetooth|smartphone/i, icon: Smartphone },
  { match: /camera|parking|sensor|360/i, icon: Camera },
  { match: /cruise|drive assist|pilot|adaptive/i, icon: Gauge },
  { match: /roof|sunroof|panoramic/i, icon: Sun },
  { match: /sound|audio|speaker|entertainment|bose|burmester|sound system/i, icon: Music },
  { match: /keyless|entry|push start|immobilis|immobiliz/i, icon: KeyRound },
];

const featureIcon = (label = "") =>
  FEATURE_ICONS.find((entry) => entry.match.test(label))?.icon || null;

// Quiet upward fade reveal on scroll.
const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Renders whatever image source the vehicle record supplies. If a frame is
// missing or fails to load it degrades to the neutral frame background — the
// frontend never substitutes imagery of its own.
const SmartImage = ({ src, alt, className, ...rest }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className={`${className} bg-[#0d0f13]`} aria-hidden="true" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
};

export const CarDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // The vehicle record is supplied by the fleet card. Direct visits fall back
  // to the existing local fleet data source rather than an empty page.
  const car = useMemo(() => {
    const stateCar = location.state?.car;
    if (stateCar && (stateCar.name || stateCar.model)) return stateCar;
    return (
      localFleet.find((item) =>
        /g 63|g-class/i.test(`${item.name} ${item.model}`),
      ) ||
      localFleet[0] ||
      {}
    );
  }, [location.state]);

  // Everything below is read from the vehicle record — nothing is invented.
  const identity = useMemo(() => resolveIdentity(car), [car]);
  const vehicleName = identity.manufacturer || "Executive Vehicle";
  const fullTitle = useMemo(
    () => formatVehicleTitle(vehicleName, identity.model || car.model || ""),
    [vehicleName, identity.model, car.model],
  );
  const displayPrice = useMemo(() => resolvePrice(car), [car]);
  const availability = useMemo(() => resolveAvailability(car), [car]);
  const description = useMemo(() => resolveDescription(car), [car]);
  const specs = useMemo(() => resolveSpecs(car), [car]);
  const features = useMemo(() => resolveFeatures(car), [car]);
  const conditions = useMemo(() => resolveRentalConditions(car), [car]);
  const terms = useMemo(() => resolveRentalTerms(car), [car]);
  const related = useMemo(() => getRelatedVehicles(car, localFleet, 4), [car]);

  // Showroom photography: the record's own images first, completed by the
  // brand's fleet photography and the interior set.
  const images = useMemo(() => resolveGalleryImages(car, resolveAsset), [car]);

  const experienceImages = useMemo(
    () =>
      resolveExperienceImages(
        car,
        resolveAsset,
        images.filter((item) => item.group === "Interior"),
      ),
    [car, images],
  );

  const summaryText = useMemo(
    () =>
      description ||
      `Reserve the ${fullTitle} from our Lagos fleet. Our concierge confirms availability, handover and timing at reservation.`,
    [description, fullTitle],
  );

  const total = images.length;
  const multiImage = total > 1;

  // ---------------------------------------------------------------- gallery
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const activeIndexRef = useRef(0);
  const fadeTimer = useRef(null);

  const goTo = useCallback(
    (index) => {
      if (total < 2) return;
      const next = ((index % total) + total) % total;
      if (next === activeIndexRef.current) return;
      activeIndexRef.current = next;
      setVisible(false);
      clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => {
        setActiveIndex(next);
        setVisible(true);
      }, 200);
    },
    [total],
  );

  const nextImage = useCallback(() => goTo(activeIndexRef.current + 1), [goTo]);
  const prevImage = useCallback(() => goTo(activeIndexRef.current - 1), [goTo]);

  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxOpen, nextImage, prevImage]);

  // Swipe navigation for the mobile gallery
  const touchStartX = useRef(null);
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };
  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 45) {
      if (delta < 0) nextImage();
      else prevImage();
    }
    touchStartX.current = null;
  };

  // Starts the existing booking flow with the currently displayed vehicle.
  // No booking information is collected on this page.
  const handleBook = () => {
    addToCart({
      ...car,
      name: vehicleName,
      model: identity.model || car.model,
      category: identity.category || car.category,
      image: images[0]?.src,
      loanPrice: displayPrice || car.loanPrice || car.price,
    });
    navigate("/checkout");
  };

  const activeItem = images[activeIndex] || images[0] || null;
  const sideThumbIndexes = useMemo(
    () =>
      multiImage
        ? Array.from({ length: Math.min(3, total - 1) }, (_, index) => index + 1)
        : [],
    [multiImage, total],
  );

  const experiencePrimary = experienceImages[0] || null;
  const experienceSide = experienceImages.slice(1, 3);
  const experienceRest = experienceImages.slice(3, 6);

  return (
    <div className="min-h-screen bg-[#000000] pb-24 font-['Plus_Jakarta_Sans',sans-serif] text-[#e4e4e7] selection:bg-amber-400/30 selection:text-amber-200 lg:pb-0">
      <Header />
      <Cart />

      <main>
        {/* -------------------------------------------------- Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em]"
            >
              <Link
                to="/"
                className="text-slate-500 transition-colors hover:text-slate-300"
              >
                Fleet
              </Link>
              <span className="text-slate-700">/</span>
              {identity.category ? (
                <>
                  <span className="text-slate-500">{identity.category}</span>
                  <span className="text-slate-700">/</span>
                </>
              ) : null}
              <span className="text-slate-300">{fullTitle}</span>
            </nav>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-amber-500"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Fleet
            </Link>
          </div>
        </div>

        {/* -------------------------------------------------- Identity */}
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-12">
          <Reveal className="border-b border-white/[0.08] pb-8">
            <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-amber-500">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {availability.label}
            </span>
            <h1 className="mt-4 font-['Playfair_Display',serif] text-4xl font-normal leading-[1.02] tracking-[-0.03em] text-[#f5f3ee] sm:text-5xl lg:text-6xl">
              {vehicleName}
            </h1>
            {identity.model ? (
              <p className="mt-2 text-lg font-light text-slate-300">
                {identity.model}
                {identity.trim ? ` · ${identity.trim}` : ""}
              </p>
            ) : null}
            {identity.category ? (
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Category ·{" "}
                <span className="text-slate-300">{identity.category}</span>
              </p>
            ) : null}
          </Reveal>
        </section>

{/* -------------------------------------------------- Gallery + panel */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left column — photography, summary, specifications */}
            <div className="lg:col-span-8">
              <Reveal>
                <div
                  className={`grid grid-cols-1 gap-3 ${
                    sideThumbIndexes.length ? "lg:grid-cols-[1fr_200px]" : ""
                  }`}
                >
                  {/* Primary frame */}
                  <div
                    className="group relative aspect-[4/3] w-full overflow-hidden bg-[#08090b]"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    <SmartImage
                      src={activeItem?.src}
                      alt={
                        activeItem?.label
                          ? `${fullTitle} — ${activeItem.label}`
                          : fullTitle
                      }
                      className={`h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-[1.02] ${
                        visible ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {activeItem ? null : (
                      <p className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-[0.2em] text-slate-600">
                        Imagery unavailable
                      </p>
                    )}

                    {multiImage ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setLightboxOpen(true)}
                          aria-label="Open full-screen gallery"
                          className="absolute inset-0 z-10 cursor-zoom-in"
                        />

                        <button
                          type="button"
                          onClick={prevImage}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 border border-white/[0.14] bg-black/40 p-2 text-slate-200 transition-all duration-300 hover:border-amber-500 hover:text-amber-500 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 border border-white/[0.14] bg-black/40 p-2 text-slate-200 transition-all duration-300 hover:border-amber-500 hover:text-amber-500 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2">
                          <span className="border border-white/[0.14] bg-black/40 px-2 py-1 font-mono text-[10px] tracking-wider text-slate-300">
                            {activeIndex + 1} / {total}
                          </span>
                          <span className="hidden border border-white/[0.14] bg-black/40 p-1.5 text-slate-300 sm:block">
                            <Maximize2 className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </>
                    ) : null}

                    {activeItem?.label ? (
                      <div className="pointer-events-none absolute bottom-0 left-0 z-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-5 pb-4 pt-12">
                        {activeItem.group ? (
                          <p className="text-[10px] uppercase tracking-[0.22em] text-amber-500">
                            {activeItem.group}
                          </p>
                        ) : null}
                        <p className="mt-1 text-sm font-light text-slate-200">
                          {activeItem.label}
                        </p>
                      </div>
                    ) : null}
                  </div>
{/* Supporting frames (desktop) */}
                  {sideThumbIndexes.length ? (
                    <div
                      className="hidden gap-3 lg:grid"
                      style={{
                        gridTemplateRows: `repeat(${sideThumbIndexes.length}, minmax(0, 1fr))`,
                      }}
                    >
                      {sideThumbIndexes.map((index) => {
                        const item = images[index];
                        const isActive = index === activeIndex;
                        return (
                          <button
                            key={item.src}
                            type="button"
                            onClick={() => goTo(index)}
                            aria-label={`View image ${index + 1} of ${total}`}
                            className={`group/thumb relative w-full overflow-hidden border bg-[#08090b] transition-all duration-300 ${
                              isActive
                                ? "border-amber-500"
                                : "border-white/[0.08] hover:border-white/25"
                            }`}
                          >
                            <SmartImage
                              src={item.src}
                              alt={
                                item.label || `${fullTitle} view ${index + 1}`
                              }
                              className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover/thumb:scale-[1.04] group-hover/thumb:opacity-100"
                            />
                            {item.label ? (
                              <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-[0.16em] text-slate-200">
                                {item.label}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {/* Frame strip (mobile) */}
                {multiImage ? (
                  <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
                    {images.map((item, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={item.src}
                          type="button"
                          onClick={() => goTo(index)}
                          aria-label={`View image ${index + 1} of ${total}`}
                          className={`relative h-16 w-24 shrink-0 overflow-hidden border transition-all duration-300 ${
                            isActive
                              ? "border-amber-500 opacity-100"
                              : "border-white/[0.08] opacity-60"
                          }`}
                        >
                          <SmartImage
                            src={item.src}
                            alt={item.label || `${fullTitle} view ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </Reveal>

              {/* Summary */}
              <Reveal className="mt-16 border-t border-white/[0.08] pt-8">
                <p className="max-w-2xl text-base font-light leading-8 text-slate-300">
                  {summaryText}
                </p>
              </Reveal>

              {/* Key specifications */}
              {specs.length ? (
                <Reveal className="mt-16">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
                    Key specifications
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
                    {specs.map((spec, index) => (
                      <div
                        key={`${spec.label}-${spec.value}-${index}`}
                        className="border-t border-white/[0.12] pt-4"
                      >
                        {spec.label ? (
                          <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                            {spec.label}
                          </dt>
                        ) : null}
                        <dd className="mt-2 text-lg font-medium text-[#f5f3ee]">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              ) : null}
            </div>
{/* Right column — vehicle information panel (sticky on desktop) */}
            <aside className="lg:col-span-4">
              <Reveal className="lg:sticky lg:top-28">
                <div className="border border-white/[0.1] bg-[#0a0b0e] p-6 sm:p-7">
                  <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-amber-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {availability.label}
                  </span>

                  <p className="mt-4 font-['Playfair_Display',serif] text-2xl font-normal leading-[1.12] tracking-[-0.02em] text-[#f5f3ee]">
                    {vehicleName}
                  </p>
                  {identity.model ? (
                    <p className="mt-1.5 text-sm font-light text-slate-400">
                      {identity.model}
                      {identity.trim ? ` · ${identity.trim}` : ""}
                    </p>
                  ) : null}
                  {identity.category ? (
                    <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                      {identity.category}
                    </p>
                  ) : null}

                  <div className="mt-6 border-t border-white/[0.08] pt-6">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Daily rate
                    </p>
                    <p className="mt-1.5 text-3xl font-semibold text-amber-500">
                      {displayPrice || "Rate on request"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleBook}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-amber-500 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-amber-400"
                  >
                    Book this car
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="mt-3 text-[11px] font-light leading-5 text-slate-400">
                    Booking details are collected in the next step.
                  </p>

                  <p className="mt-5 flex items-center gap-2 border-t border-white/[0.08] pt-5 text-[11px] font-light text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    Exact vehicle guaranteed · no substitution
                  </p>
                </div>
              </Reveal>
            </aside>
          </div>
        </section>

        {/* -------------------------------------------------- Inside the experience */}
        {experiencePrimary ? (
          <section className="mx-auto max-w-7xl border-t border-white/[0.08] px-4 py-20 sm:px-6 sm:py-24 lg:px-12">
            <Reveal>
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
                Interior
              </span>
              <h2 className="mt-4 font-['Playfair_Display',serif] text-4xl font-normal leading-[1.05] tracking-[-0.03em] text-[#f5f3ee] sm:text-5xl">
                Inside the experience.
              </h2>
              <p className="mt-5 max-w-xl text-sm font-light leading-7 text-slate-400">
                A closer look inside the {fullTitle} — the cabin, the materials
                and the space you actually spend your journey in.
              </p>
            </Reveal>

            <div
              className={`mt-10 grid grid-cols-1 gap-3 ${
                experienceSide.length ? "lg:grid-cols-12" : ""
              }`}
            >
              <Reveal
                className={experienceSide.length ? "lg:col-span-8" : undefined}
              >
                <SmartImage
                  src={experiencePrimary.src}
                  alt={
                    experiencePrimary.label ||
                    `${fullTitle} — additional view`
                  }
                  className="aspect-[16/10] w-full object-cover object-center"
                />
              </Reveal>

              {experienceSide.length ? (
                <div className="grid grid-cols-2 gap-3 lg:col-span-4 lg:grid-cols-1">
                  {experienceSide.map((item, index) => (
                    <Reveal key={item.src} delay={80 * (index + 1)}>
                      <SmartImage
                        src={item.src}
                        alt={item.label || `${fullTitle} — view ${index + 2}`}
                        className="aspect-[4/3] w-full object-cover object-center lg:aspect-[16/10]"
                      />
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </div>

            {experienceRest.length ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {experienceRest.map((item, index) => (
                  <Reveal key={item.src} delay={80 * index}>
                    <figure>
                      <SmartImage
                        src={item.src}
                        alt={item.label || `${fullTitle} — view ${index + 4}`}
                        className="aspect-[4/3] w-full object-cover object-center"
                      />
                      {item.label ? (
                        <figcaption className="mt-2.5 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                          {item.label}
                        </figcaption>
                      ) : null}
                    </figure>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {/* -------------------------------------------------- Features */}
        {features.length ? (
          <section className="border-t border-white/[0.08] bg-[#05070c] py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
              <Reveal>
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
                  Equipment
                </span>
                <h2 className="mt-4 font-['Playfair_Display',serif] text-4xl font-normal leading-[1.05] tracking-[-0.03em] text-[#f5f3ee] sm:text-5xl">
                  The details that matter.
                </h2>
              </Reveal>

              <div className="mt-10 grid grid-cols-1 gap-x-14 sm:grid-cols-2">
                {features.map((feature, index) => {
                  const Icon = featureIcon(feature.label);
                  return (
                    <Reveal key={`${feature.label}-${index}`} delay={40 * index}>
                      <div className="flex items-center gap-4 border-t border-white/[0.1] py-4">
                        {Icon ? (
                          <Icon
                            className="h-4 w-4 shrink-0 text-amber-500"
                            strokeWidth={1.6}
                          />
                        ) : (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        )}
                        <span className="text-sm font-light text-slate-200">
                          {feature.label}
                        </span>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
{/* -------------------------------------------------- Before you book */}
        <section className="border-t border-white/[0.08] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Reveal>
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
                    Before you book
                  </span>
                  <h2 className="mt-4 font-['Playfair_Display',serif] text-4xl font-normal leading-[1.05] tracking-[-0.03em] text-[#f5f3ee] sm:text-5xl">
                    Rental information.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm font-light leading-7 text-slate-400">
                    Everything you need to know before you reserve. Our
                    concierge confirms the details with you at pickup.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowTerms((value) => !value)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-500 transition-colors hover:text-amber-400"
                  >
                    {showTerms
                      ? "Hide full rental terms"
                      : "View full rental terms"}
                    <ArrowRight
                      className={`h-4 w-4 transition-transform duration-300 ${
                        showTerms ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {showTerms ? (
                    <ul className="mt-6 space-y-3.5 border-l border-amber-500/40 pl-4">
                      {terms.map((term) => (
                        <li
                          key={term}
                          className="text-xs font-light leading-6 text-slate-400"
                        >
                          {term}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Reveal>
              </div>

              <div className="lg:col-span-8">
                <Reveal>
                  <dl className="border-t border-white/[0.1]">
                    {conditions.map((condition, index) => (
                      <div
                        key={`${condition.label}-${index}`}
                        className="grid grid-cols-1 gap-1 border-b border-white/[0.1] py-4 sm:grid-cols-[minmax(11rem,1fr)_2fr] sm:items-baseline sm:gap-6"
                      >
                        {condition.label ? (
                          <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                            {condition.label}
                          </dt>
                        ) : null}
                        <dd className="text-sm font-light text-slate-200">
                          {condition.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
{/* -------------------------------------------------- Explore more */}
        {related.length ? (
          <section className="border-t border-white/[0.08] py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
              <Reveal>
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
                  Continue browsing
                </span>
                <h2 className="mt-4 font-['Playfair_Display',serif] text-4xl font-normal leading-[1.05] tracking-[-0.03em] text-[#f5f3ee] sm:text-5xl">
                  Explore more vehicles.
                </h2>
              </Reveal>

              <div className="mt-10 grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-8">
                {related.map((item, index) => (
                  <Reveal
                    key={`${item.name}-${item.model}-${index}`}
                    delay={60 * index}
                  >
                    <CarDetail cardata={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* -------------------------------------------------- Final CTA */}
        <section className="border-t border-white/[0.08] bg-[#05070c] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
                  Reservations
                </span>
                <h2 className="mt-4 font-['Playfair_Display',serif] text-4xl font-normal leading-[1.02] tracking-[-0.03em] text-[#f5f3ee] sm:text-5xl lg:text-6xl">
                  Ready to take the wheel.
                </h2>
                <p className="mt-4 text-sm font-light text-slate-300 sm:text-base">
                  Reserve a vehicle or speak with our concierge.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                <button
                  type="button"
                  onClick={handleBook}
                  className="inline-flex items-center gap-2 bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
                >
                  Book this car
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="tel:+2348008274666"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition-colors hover:text-white"
                >
                  Contact Concierge
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer showCta={false} />

      {/* -------------------------------------------------- Sticky mobile action */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.1] bg-black/95 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Daily rate
            </p>
            <p className="text-sm font-semibold text-amber-500">
              {displayPrice || "Rate on request"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBook}
            className="bg-amber-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-amber-400"
          >
            Book this car
          </button>
        </div>
      </div>

      {/* -------------------------------------------------- Full-screen gallery */}
      {lightboxOpen && multiImage ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${fullTitle} gallery`}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-amber-500">
                {activeItem?.group || "Gallery"}
              </p>
              <p className="mt-1 text-sm font-light text-slate-200">
                {activeItem?.label
                  ? `${fullTitle} — ${activeItem.label}`
                  : fullTitle}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs tracking-wider text-slate-400">
                {activeIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close gallery"
                className="p-1 text-slate-300 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 sm:px-14">
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 border border-white/[0.14] bg-black/40 p-2.5 text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-500 sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <SmartImage
              src={activeItem?.src}
              alt={activeItem?.label || fullTitle}
              className={`max-h-[68vh] w-auto max-w-full object-contain transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 border border-white/[0.14] bg-black/40 p-2.5 text-slate-200 transition-colors hover:border-amber-500 hover:text-amber-500 sm:right-4"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2.5 overflow-x-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`View image ${index + 1} of ${total}`}
                  className={`h-14 w-20 shrink-0 overflow-hidden border transition-all duration-300 ${
                    isActive
                      ? "border-amber-500 opacity-100"
                      : "border-white/[0.1] opacity-50 hover:opacity-90"
                  }`}
                >
                  <SmartImage
                    src={item.src}
                    alt={item.label || `${fullTitle} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CarDetailsPage;
