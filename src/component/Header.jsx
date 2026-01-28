import { useState } from "react";
import { useCart } from "../context/CartContext";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  return (
    <nav className="sticky top-0 z-30 bg-white/60 backdrop-blur-sm dark:bg-[#0b1220]/60 border-b border-white/10">
      <div className="max-w-[1380px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/vite.svg" alt="logo" className="h-8 w-8" />
          <h2 className="text-xl font-semibold italic tracking-tight text-slate-800 dark:text-slate-100">
            Tasin Car Rental
          </h2>
        </div>

        <button
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <ul className={`hidden md:flex items-center gap-4`}>
          <li>
            <a
              href="#services"
              className="px-3 py-2 rounded-md text-sm hover:underline hover:underline-offset-4"
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="px-3 py-2 rounded-md text-sm hover:underline hover:underline-offset-4"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#reviews"
              className="px-3 py-2 rounded-md text-sm hover:underline hover:underline-offset-4"
            >
              Reviews
            </a>
          </li>
          <li>
            <button
              onClick={toggleCart}
              className="relative px-4 py-2 bg-amber-400 text-slate-900 rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-white/60 dark:bg-[#071022]/60">
          <div className="px-4 py-3 flex flex-col gap-2">
            <a
              href="#services"
              className="py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Services
            </a>
            <a
              href="#about"
              className="py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About
            </a>
            <a
              href="#reviews"
              className="py-2 px-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Reviews
            </a>
            <button
              onClick={() => {
                setOpen(false);
                toggleCart();
              }}
              className="relative py-2 px-3 rounded-md bg-amber-400 text-slate-900 font-medium text-center"
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute top-1 right-3 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
