import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// Helper to parse price string
const parsePrice = (priceStr) => {
  if (typeof priceStr === "number") return priceStr;
  const match = priceStr?.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      {/* Cart Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
            <p className="text-sm text-slate-500">
              {totalItems} {totalItems === 1 ? "car" : "cars"} selected
            </p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">Your cart is empty</p>
              <p className="text-slate-400 text-sm mt-1">
                Add cars to get started
              </p>
            </div>
          ) : (
            items.map((item) => {
              const pricePerDay = parsePrice(
                item.car.loanPrice || item.car.price
              );
              const itemTotal = pricePerDay * item.duration;

              return (
                <div
                  key={item.car.name}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.car.image}
                      alt={item.car.name}
                      className="w-20 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">
                        {item.car.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {item.car.model || item.car.category}
                      </p>
                      <p className="text-sm text-indigo-600 font-medium mt-1">
                        ₦{pricePerDay.toLocaleString()} / day
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.car.name)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Duration Controls */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600">Duration:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateDuration(item.car.name, item.duration - 1)
                          }
                          disabled={item.duration <= 1}
                          className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-semibold text-slate-900">
                          {item.duration}
                        </span>
                        <button
                          onClick={() =>
                            updateDuration(item.car.name, item.duration + 1)
                          }
                          className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center hover:bg-indigo-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-slate-500">days</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₦{itemTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-6 space-y-4">
            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} cars)</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service fee (2%)</span>
                <span>₦{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (7.5%)</span>
                <span>₦{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleProceedToPayment}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98]"
              >
                Proceed to Payment
              </button>
              <button
                onClick={clearCart}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
