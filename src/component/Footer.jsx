import { Car, ArrowRight, Phone, MessageSquare, Mail } from "lucide-react";

export const Footer = ({ showCta = true }) => {
  return (
    <footer className="bg-[#000000] text-slate-400 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Final CTA Section (Quiet, spacious, and premium).
          Suppressed on pages that already close with their own CTA. */}
      {showCta ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-28 sm:py-36">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-xl">
              <span className="text-[11px] font-medium tracking-[0.22em] text-amber-500 uppercase block mb-5">Reservations</span>
              <h3 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-[-0.03em] leading-[1.02]">
                Ready to take the wheel?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mt-3 font-light leading-relaxed">
                Reserve a vehicle or speak with our concierge.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#fleet"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Reserve a Vehicle</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="tel:+2348008274666"
                className="py-3 text-[#f5f5f7] font-['Plus_Jakarta_Sans',sans-serif] font-medium text-sm transition-colors hover:text-amber-400 flex items-center gap-2 cursor-pointer"
              >
                <span>Contact Concierge</span>
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Footer Columns (Simplified, Authentic & Restrained) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: TASIN MOBILITY */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 flex items-center justify-center text-slate-950">
                <Car className="w-4 h-4 text-slate-950 stroke-[2.4]" />
              </div>
              <div>
                <span className="font-['Syne',sans-serif] text-sm font-bold tracking-[0.2em] uppercase text-white block">
                  TASIN MOBILITY
                </span>
                <span className="text-xs tracking-wider text-slate-400 uppercase font-light">
                  Chauffeur & Luxury Vehicle Rentals
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-light">
              Chauffeur and vehicle hire for private and executive journeys across Lagos.
            </p>
          </div>

          {/* Column 2: SERVICES */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm font-light text-slate-400">
              <li>
                <a href="#fleet" className="hover:text-amber-400 transition-colors">
                  Chauffeur Service
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-amber-400 transition-colors">
                  Self Drive
                </a>
              </li>
              <li>
                <a href="#standards" className="hover:text-amber-400 transition-colors">
                  Airport Transfers
                </a>
              </li>
              <li>
                <a href="#standards" className="hover:text-amber-400 transition-colors">
                  Corporate Travel
                </a>
              </li>
              <li>
                <a href="#standards" className="hover:text-amber-400 transition-colors">
                  Events & Special Occasions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: LOCATIONS (Confirmed locations only) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white">
              Locations
            </h4>
            <ul className="space-y-2.5 text-sm font-light text-slate-400">
              <li>
                <span className="text-slate-200 block font-normal">Lagos Airport Hub</span>
                <span className="text-xs text-slate-400">MMIA Ikeja Terminal</span>
              </li>
              <li>
                <span className="text-slate-200 block font-normal">Island Districts</span>
                <span className="text-xs text-slate-400">Victoria Island & Ikoyi</span>
              </li>
              <li>
                <span className="text-slate-200 block font-normal">Lekki Corridor</span>
                <span className="text-xs text-slate-400">Phase 1 & Chevron</span>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT & LEGAL */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-3 text-sm font-light text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:+2348008274666" className="hover:text-white transition-colors">
                  +234 (0) 800 827 4666
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="https://wa.me/2348008274666" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Concierge
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:concierge@tasinmobility.com" className="hover:text-white transition-colors">
                  concierge@tasinmobility.com
                </a>
              </li>
            </ul>

            <div className="pt-4 mt-4 border-t border-white/[0.05]">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-1.5">
                Legal
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 font-light">
                <span className="hover:text-white cursor-pointer">Terms</span>
                <span className="hover:text-white cursor-pointer">Privacy</span>
                <span className="hover:text-white cursor-pointer">Rental Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-light text-slate-500">
          <div>
            © {new Date().getFullYear()} TASIN MOBILITY. All rights reserved.
          </div>
          <div className="text-xs font-mono text-slate-500 tracking-wider">
            LAGOS · NIGERIA
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
