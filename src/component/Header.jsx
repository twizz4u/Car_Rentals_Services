import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Car, Menu, X } from "lucide-react";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/95 text-[#e4e4e7] backdrop-blur-sm font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-[76px] flex items-center justify-between">
        
        {/* Brand Lockup */}
        <Link
          to="/"
          className="flex items-center gap-3.5 group focus:outline-none"
          aria-label="TASIN MOBILITY Home"
        >
          <div className="w-8 h-8 bg-amber-500 flex items-center justify-center text-black">
            <Car className="w-4 h-4 text-black stroke-[2.4]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-['Syne',sans-serif] text-sm font-bold tracking-[0.22em] uppercase text-white">
              TASIN MOBILITY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — Quiet & Spacious */}
        <nav className="hidden lg:flex items-center gap-9 text-[15px] font-medium">
          <a
            href="#fleet"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Fleet
          </a>
          <a
            href="#fleet"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Categories
          </a>
          <a
            href="#locations"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Locations
          </a>
          <a
            href="#standards"
            className="text-slate-300 hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="#reviews"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Reviews
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-5">
          {/* Reservations Trigger */}
          <button
            onClick={toggleCart}
            aria-label="View reserved vehicles"
            className="relative text-sm font-medium text-white transition-colors hover:text-amber-400 flex items-center gap-2 cursor-pointer"
          >
            <span>Reservations</span>
            {totalItems > 0 && (
              <span className="bg-amber-400 text-black font-bold text-xs px-1.5 py-0.5 leading-tight">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Authentication or Driver Portal */}
          {user ? (
            <div className="hidden sm:flex items-center gap-3 pl-2">
              <span className="text-sm font-mono text-slate-300 truncate max-w-[130px]">
                {user.name || user.email?.split("@")[0]}
              </span>
              <button
                onClick={logout}
                className="text-xs font-mono uppercase text-rose-400 hover:text-rose-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/customer-login"
              className="hidden sm:inline-flex text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Driver Portal</span>
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((s) => !s)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0c0f17] px-6 py-6 flex flex-col gap-4">
          <a
            href="#fleet"
            onClick={() => setOpen(false)}
            className="text-base font-medium text-slate-200 hover:text-amber-400 transition-colors py-1"
          >
            Fleet
          </a>
          <a
            href="#fleet"
            onClick={() => setOpen(false)}
            className="text-base font-medium text-slate-200 hover:text-amber-400 transition-colors py-1"
          >
            Categories
          </a>
          <a
            href="#locations"
            onClick={() => setOpen(false)}
            className="text-base font-medium text-slate-200 hover:text-amber-400 transition-colors py-1"
          >
            Locations
          </a>
          <a
            href="#standards"
            onClick={() => setOpen(false)}
            className="text-base font-medium text-slate-200 hover:text-amber-400 transition-colors py-1"
          >
            How It Works
          </a>
          <a
            href="#reviews"
            onClick={() => setOpen(false)}
            className="text-base font-medium text-slate-200 hover:text-amber-400 transition-colors py-1"
          >
            Reviews
          </a>
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <Link
              to="/customer-login"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-300 hover:text-white"
            >
              Driver Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
