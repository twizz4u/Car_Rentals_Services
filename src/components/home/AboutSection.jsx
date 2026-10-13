// About: quiet, editorial brand presence.
export const AboutSection = () => {
  return (
    <section id="about" className="py-28 sm:py-36 bg-[#000000] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs tracking-[0.25em] text-amber-500 uppercase block mb-3">
              ABOUT TASIN MOBILITY
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.12]">
              Mobility, handled properly.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            <p>
              TASIN MOBILITY provides private chauffeur services and executive
              vehicle hire for corporate executives, diplomatic visits, and
              discerning travelers across Lagos.
            </p>
            <p className="text-slate-400">
              Punctuality, vehicle preparation and discretion guide every
              journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
