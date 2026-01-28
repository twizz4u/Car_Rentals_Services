export const Hero = () => {
  return (
    <header
      className="relative h-[85vh] bg-[url('/cars/header_1.jpg')] bg-cover bg-center bg-no-repeat animate-bg-zoom flex items-center"
      aria-label="Hero section with featured car"
    >
  
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent motion-safe:animate-fade-in"></div>

      <div className="max-w-[1200px] mx-auto relative z-10 px-6 md:px-8">
        <div className="md:w-2/3 lg:w-1/2 text-white motion-safe:animate-fade-in-up">
          <p className="text-sm uppercase tracking-wider text-amber-300 font-medium mb-3">
            Premium & reliable
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Drive the car you deserve
          </h1>
          <p className="text-slate-100/90 mb-6">
            Explore our curated fleet of luxury and budget-friendly vehicles.
            Book in minutes and enjoy flexible pickup and return options.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#search"
              className="inline-block bg-amber-400 text-slate-900 px-4 py-2 rounded-md font-medium shadow hover:scale-[1.01] transition-transform motion-safe:animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
            >
              Book now
            </a>

            <a
              href="#fleet"
              className="inline-block border border-white/30 px-4 py-2 rounded-md text-white/90 hover:bg-white/5 transition motion-safe:animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              View fleet
            </a>
          </div>
        </div>
      </div>

      <a
        href="#search"
        aria-label="Scroll to search"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white/90 backdrop-blur motion-safe:animate-bounce"
      >
        ↓
      </a>
    </header>
  );
};
