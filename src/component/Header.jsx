import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Car, Menu, X } from "lucide-react";

// Section anchors on the Home page. Each label mirrors the heading of the
// section it targets, and every entry has a unique destination.
const NAV_LINKS = [
  { id: "fleet", label: "Fleet" },
  { id: "standards", label: "Service" },
  { id: "locations", label: "Locations" },
  { id: "about", label: "About" },
  { id: "reviews", label: "Reviews" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Section links must work from every page that renders Header. On the Home
  // page we scroll directly to the section; anywhere else (e.g. /car-details)
  // we navigate home with the hash and let the effect below scroll once the
  // section has rendered.
  const handleNavClick = (id) => {
    setOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `/#${id}`);
        return;
      }
    }
    navigate({ pathname: "/", hash: `#${id}` });
  };

  // After navigating from another page, scroll to the section in the hash.
  useEffect(() => {
    const id = location.hash.replace("#", "");
    if (location.pathname !== "/" || !id) return;
    let raf = requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname, location.hash]);

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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={`/#${link.id}`}
              onClick={() => handleNavClick(link.id)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
              <Link
                to="/account"
                className="text-xs font-mono uppercase text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                Driver Portal
              </Link>
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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={`/#${link.id}`}
              onClick={() => handleNavClick(link.id)}
              className="text-base font-medium text-slate-200 hover:text-amber-400 transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            {user ? (
              <Link
                to="/account"
                onClick={() => setOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Driver Portal
              </Link>
            ) : (
              <Link
                to="/customer-login"
                onClick={() => setOpen(false)}
                className="text-sm text-slate-300 hover:text-white"
              >
                Driver Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
