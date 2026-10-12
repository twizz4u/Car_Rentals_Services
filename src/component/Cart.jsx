import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, ArrowRight, Car, Check } from "lucide-react";
import { resolveAsset, formatVehicleTitle } from "./CarDetails";

// Helper to parse price string like "₦150,000 / day" to number
const parsePrice = (priceStr) => {
  if (typeof priceStr === "number") return priceStr;
  const match = priceStr?.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
};

// Fallback image helper
const getVehicleImage = (image, name = "", model = "") => {
  if (image && !image.includes("placeholder")) {
    return resolveAsset(image);
  }
  const lower = (name + " " + model).toLowerCase();
  if (lower.includes("bmw")) return resolveAsset("/cars/BMW_7.webp");
  if (lower.includes("cadillac")) return resolveAsset("/cars/Cadillac.webp");
  if (lower.includes("genesis")) return resolveAsset("/cars/Genesis.webp");
  if (lower.includes("lexus")) return resolveAsset("/cars/Lexus.webp");
  if (lower.includes("lincoln")) return resolveAsset("/cars/Lincoln_Navigator.webp");
  if (lower.includes("porsche")) return resolveAsset("/cars/Porsche.webp");
  if (lower.includes("volvo")) return resolveAsset("/cars/Volvo.webp");
  if (lower.includes("gmc")) return resolveAsset("/cars/GMC_Sierra.webp");
  return resolveAsset("/cars/hero_mercedes_s580.jpg");
};

export const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    totalItems,
    totalAmount,
    removeFromCart,
    updateDuration,
    clearCart,
    closeCart,
  } = useCart();

  if (!isOpen) return null;

  const serviceFee = totalAmount ? Math.round(totalAmount * 0.02) : 0;
  const tax = totalAmount ? Math.round(totalAmount * 0.075) : 0;
  const grandTotal = totalAmount + serviceFee + tax;

  const handleProceedToPayment = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleBrowseFleet = () => {
    closeCart();
    const fleetEl = document.getElementById("fleet");
    if (fleetEl) {
      fleetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Cart Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <aside
          className="w-screen max-w-md bg-[#090b0e] border-l border-white/[0.08] text-slate-300 shadow-2xl flex flex-col transform transition-transform ease-out duration-300"
          aria-labelledby="booking-drawer-title"
        >
          {/* 1. Header Bar */}
          <div className="px-6 py-5 border-b border-white/[0.06] bg-[#090b0e] flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
                Booking
              </span>
              <h2
                id="booking-drawer-title"
                className="mt-1 font-['Playfair_Display',serif] text-2xl font-normal text-[#f5f3ee] tracking-tight"
              >
                My Booking
              </h2>
              <p className="mt-1 text-xs text-slate-400 font-light">
                {totalItems} {totalItems === 1 ? "vehicle" : "vehicles"} selected
              </p>
            </div>

            <button
              onClick={closeCart}
              aria-label="Close booking drawer"
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 px-4 my-6">
                <div className="w-12 h-12 rounded-full border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="font-['Playfair_Display',serif] text-lg font-normal text-[#f5f3ee]">
                  Your booking list is empty
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed font-light">
                  Select vehicles from the showroom to customize your rental duration and proceed to checkout.
                </p>
                <button
                  onClick={handleBrowseFleet}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Browse available fleet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => {
                const pricePerDay = parsePrice(item.car.loanPrice || item.car.price);
                const itemTotal = pricePerDay * item.duration;
                const carImg = getVehicleImage(item.car.image, item.car.name, item.car.model);
                const fullTitle = formatVehicleTitle(item.car.name, item.car.model);
                const rawSpecs =
                  item.car.specs ||
                  item.car.category ||
                  "Automatic · 5 seats · Chauffeur available";
                const specs = rawSpecs
                  .replace(/\bSeats\b/g, "seats")
                  .replace(/\bChauffeur\b(?! available)/g, "Chauffeur available")
                  .replace(/\bDriver\b/g, "Chauffeur available");

                return (
                  <div
                    key={item.car.name}
                    className="p-4 rounded-[4px] bg-[#0c0e13] border border-white/[0.06] space-y-3.5"
                  >
                    <div className="flex gap-3.5 items-start">
                      {/* Vehicle Image */}
                      <div className="relative w-24 h-16 rounded-[2px] overflow-hidden bg-[#07080a] shrink-0 border border-white/[0.06]">
                        <img
                          src={carImg}
                          alt={fullTitle}
                          className="w-full h-full object-cover object-center brightness-[0.93]"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                      </div>

                      {/* Information */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-[#f5f3ee] truncate leading-snug">
                            {fullTitle}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.car.name)}
                            title="Remove vehicle"
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="mt-0.5 text-xs text-slate-400 font-light truncate">
                          {specs}
                        </p>

                        <span className="mt-1.5 block text-xs font-semibold text-amber-500">
                          ₦{pricePerDay.toLocaleString()}{" "}
                          <span className="text-[11px] text-slate-500 font-normal">/ day</span>
                        </span>
                      </div>
                    </div>

                    {/* Duration & Line total */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-light">Duration</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateDuration(item.car.name, item.duration - 1)}
                            disabled={item.duration <= 1}
                            aria-label="Decrease duration"
                            className="h-7 w-7 rounded-[3px] border border-white/[0.14] bg-white/[0.03] flex items-center justify-center text-slate-300 hover:border-amber-500 hover:text-amber-400 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="min-w-12 text-center font-medium text-[#f5f3ee] text-xs">
                            {item.duration} {item.duration === 1 ? "day" : "days"}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateDuration(item.car.name, item.duration + 1)}
                            aria-label="Increase duration"
                            className="h-7 w-7 rounded-[3px] border border-white/[0.14] bg-white/[0.03] flex items-center justify-center text-slate-300 hover:border-amber-500 hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block font-light">Line total</span>
                        <span className="font-semibold text-[#f5f3ee] text-sm">
                          ₦{itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 3. Pricing Summary & Checkout Actions */}
          {items.length > 0 && (
            <div className="border-t border-white/[0.06] bg-[#090b0e] p-6 space-y-4">
              {/* Financial Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400 font-light">
                  <span>Rental rate</span>
                  <span className="text-slate-200">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-light">
                  <span>Service & pre-delivery check</span>
                  <span className="text-slate-200">₦{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-light">
                  <span>VAT & insurance</span>
                  <span className="text-slate-200">₦{tax.toLocaleString()}</span>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex justify-between items-baseline">
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider block">
                      TOTAL BOOKING COST
                    </span>
                    <span className="text-xs text-emerald-400/90 font-light flex items-center gap-1.5 mt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Vehicle availability confirmed</span>
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-white">
                    ₦{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors text-center cursor-pointer font-light"
                >
                  Clear booking
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Cart;
