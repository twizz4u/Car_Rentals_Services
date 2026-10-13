// Service standards: the four pillars of the Tasin service promise.
export const ServiceStandards = () => {
  return (
    <section id="standards" className="py-28 sm:py-36 bg-[#000000] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-5">
          <span className="text-[11px] font-medium tracking-[0.22em] text-amber-500 uppercase block mb-5">
            Service
          </span>
          <h2 className="font-['Playfair_Display',serif] text-5xl sm:text-6xl lg:text-7xl font-normal text-white tracking-[-0.04em] leading-[0.95]">
            The standard of service you deserve.
          </h2>
        </div>
        <div className="lg:col-span-7 space-y-0">
          <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-white/[0.12] py-6">
            <span className="text-sm text-amber-500">01</span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                Vehicle Ready
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light mt-2.5">
                Every vehicle is cleaned and prepared before pickup.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-white/[0.12] py-6">
            <span className="text-sm text-amber-500">02</span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                Professional Chauffeurs
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light mt-2.5">
                Choose the vehicle and rental option that fits your journey.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[2rem_1fr] gap-5 border-t border-white/[0.12] py-6">
            <span className="text-sm text-amber-500">03</span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                Reliable Booking
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light mt-2.5">
                Clear pricing and straightforward reservation.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[2rem_1fr] gap-5 border-y border-white/[0.12] py-6">
            <span className="text-sm text-amber-500">04</span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-white">
                Personal Concierge
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light mt-2.5">
                Support when you need help choosing or booking a vehicle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceStandards;
