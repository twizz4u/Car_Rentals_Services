// Service coverage: where Tasin Mobility operates.
export const ServiceLocations = () => {
  return (
    <section id="locations" className="py-28 sm:py-36 bg-[#05070c] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mb-20">
          <h2 className="font-['Playfair_Display',serif] text-5xl sm:text-6xl lg:text-7xl font-normal text-white tracking-[-0.04em] leading-[0.95]">
            Stationed where
            <br />
            you need us.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-8 max-w-2xl font-light leading-8">
            From airport transfers to business districts and private
            residences, TASIN MOBILITY is positioned around the journeys
            that matter most.
          </p>
        </div>

        {/* Service Coverage Columns — Airy & Open, Not UI Dashboard Cards */}
        <div className="border-y border-white/[0.1]">
          <div className="grid grid-cols-1 gap-2 py-7 md:grid-cols-[minmax(12rem,1fr)_2fr] md:items-baseline">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold text-white">
              Lagos Airport Corridor
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Flight-aware pickup and direct transfers from MMIA.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-white/[0.1] py-7 md:grid-cols-[minmax(12rem,1fr)_2fr] md:items-baseline">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold text-white">
              Business &amp; Diplomatic Districts
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Chauffeur dispatch for meetings, appointments and evenings
              out.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-white/[0.1] py-7 md:grid-cols-[minmax(12rem,1fr)_2fr] md:items-baseline">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-semibold text-white">
              Extended &amp; Private Charters
            </h3>
            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Full-day and multi-day journeys, planned around your itinerary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceLocations;
