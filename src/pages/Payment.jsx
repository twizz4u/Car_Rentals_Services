import { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";

// Helper to parse price string
const parsePrice = (priceStr) => {
  if (typeof priceStr === "number") return priceStr;
  const match = priceStr?.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
};

export const PaymentPage = () => {
  const { items, totalItems, totalAmount, clearCart, updateDuration, removeFromCart } = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    address: "",
    zip: "",
    state: "",
    cardNo: "",
    ccv: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  const isSixDigits = /^[0-9]{6}$/;
  const isDigits = /^[0-9]+$/;

  const valid = {
    firstName: form.firstName.trim().length > 1,
    lastName: form.lastName.trim().length > 1,
    age: Number(form.age) >= 18,
    address: form.address.trim().length > 5,
    zip: isSixDigits.test(form.zip),
    state: form.state.length > 0,
    cardNo: isDigits.test(form.cardNo) && form.cardNo.length === 16,
    ccv: isDigits.test(form.ccv) && form.ccv.length === 3,
  };
  const formValid = Object.values(valid).every(Boolean) && totalItems > 0;

  // Calculate totals from cart
  const { subtotal, serviceFee, tax, total } = useMemo(() => {
    const sub = totalAmount;
    const fee = sub ? Math.round(sub * 0.02) : 0;
    const t = sub ? Math.round(sub * 0.075) : 0;
    return { subtotal: sub, serviceFee: fee, tax: t, total: sub + fee + t };
  }, [totalAmount]);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!formValid) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      clearCart();
    }, 1500);
  };

  if (success) {
    return (
      <section className="mt-16 px-4" aria-labelledby="payment-heading">
        <div className="mx-auto max-w-2xl rounded-[28px] border border-slate-100 bg-white p-12 shadow-xl text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-slate-600 mb-6">Your car rental has been confirmed. You will receive confirmation details shortly.</p>
          <a href="/" className="inline-block rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
            Back to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 px-4" aria-labelledby="payment-heading">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-100 bg-white shadow-[0_25px_65px_rgba(15,23,42,0.08)]">
        <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <header className="mb-6">
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-500">
                Checkout
              </p>
              <h2
                id="payment-heading"
                className="text-2xl font-semibold text-slate-900"
              >
                Secure payment
              </h2>
              <p className="text-sm text-slate-500">
                Complete your details to confirm your car rental.
              </p>
            </header>

            <form
              onSubmit={submit}
              className="grid gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="firstName"
                >
                  First name
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={update("firstName")}
                    aria-invalid={submitted && !valid.firstName}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                  />
                  {submitted && !valid.firstName && (
                    <span className="mt-1 block text-xs text-amber-600">
                      Enter a valid first name
                    </span>
                  )}
                </label>
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="lastName"
                >
                  Last name
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={update("lastName")}
                    aria-invalid={submitted && !valid.lastName}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                  />
                  {submitted && !valid.lastName && (
                    <span className="mt-1 block text-xs text-amber-600">
                      Enter a valid last name
                    </span>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="age"
                >
                  Age
                  <input
                    id="age"
                    type="number"
                    min={18}
                    placeholder="25"
                    value={form.age}
                    onChange={update("age")}
                    aria-invalid={submitted && !valid.age}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                  />
                  {submitted && !valid.age && (
                    <span className="mt-1 block text-xs text-amber-600">
                      You must be 18 or older
                    </span>
                  )}
                </label>
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="zip"
                >
                  Zip code
                  <input
                    id="zip"
                    type="text"
                    inputMode="numeric"
                    placeholder="100001"
                    value={form.zip}
                    onChange={update("zip")}
                    aria-invalid={submitted && !valid.zip}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                  />
                  {submitted && !valid.zip && (
                    <span className="mt-1 block text-xs text-amber-600">
                      Enter a 6-digit postal code
                    </span>
                  )}
                </label>
              </div>

              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="address"
              >
                Address
                <input
                  id="address"
                  type="text"
                  placeholder="Festac Town, Lagos"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={update("address")}
                  aria-invalid={submitted && !valid.address}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                />
                {submitted && !valid.address && (
                  <span className="mt-1 block text-xs text-amber-600">
                    Enter a complete address
                  </span>
                )}
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="cardNo"
                >
                  Card number
                  <input
                    id="cardNo"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNo}
                    onChange={update("cardNo")}
                    aria-invalid={submitted && !valid.cardNo}
                    maxLength={16}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                  />
                  {submitted && !valid.cardNo && (
                    <span className="mt-1 block text-xs text-amber-600">
                      Enter 16 digits
                    </span>
                  )}
                </label>
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="ccv"
                >
                  CCV
                  <input
                    id="ccv"
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    value={form.ccv}
                    onChange={update("ccv")}
                    aria-invalid={submitted && !valid.ccv}
                    maxLength={3}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                  />
                  {submitted && !valid.ccv && (
                    <span className="mt-1 block text-xs text-amber-600">
                      Enter 3 digits
                    </span>
                  )}
                </label>
              </div>

              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="state"
              >
                State
                <select
                  id="state"
                  value={form.state}
                  onChange={update("state")}
                  aria-invalid={submitted && !valid.state}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
                >
                  <option value="">Select State</option>
                  <option value="Oyo">Oyo State</option>
                  <option value="Ogun">Ogun State</option>
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja">Abuja</option>
                </select>
                {submitted && !valid.state && (
                  <span className="mt-1 block text-xs text-amber-600">
                    Select a state
                  </span>
                )}
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={processing || totalItems === 0}
                  className={`rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    processing || totalItems === 0 ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {processing ? "Processing…" : `Pay ₦${total.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            {/* Order Items */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400 mb-3">
                Your Order ({totalItems} {totalItems === 1 ? "car" : "cars"})
              </p>
              {items.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">
                  No cars in cart. Add cars to proceed.
                </p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {items.map((item) => {
                    const pricePerDay = parsePrice(item.car.loanPrice || item.car.price);
                    return (
                      <div key={item.car.name} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-3">
                          <img
                            src={item.car.image}
                            alt={item.car.name}
                            className="w-16 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{item.car.name}</p>
                            <p className="text-xs text-indigo-600 font-medium">₦{pricePerDay.toLocaleString()} / day</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.car.name)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                        
                        {/* Duration Controls */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Duration:</span>
                            <button
                              onClick={() => updateDuration(item.car.name, item.duration - 1)}
                              disabled={item.duration <= 1}
                              className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold text-slate-900 text-sm">
                              {item.duration}
                            </span>
                            <button
                              onClick={() => updateDuration(item.car.name, item.duration + 1)}
                              className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center hover:bg-indigo-200 text-sm"
                            >
                              +
                            </button>
                            <span className="text-xs text-slate-500">days</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            ₦{(pricePerDay * item.duration).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Order summary
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({totalItems} cars)</span>
                  <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service fee (2%)</span>
                  <span className="font-semibold">₦{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax (7.5%)</span>
                  <span className="font-semibold">₦{tax.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="text-indigo-600">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-sm text-slate-600">
              <p className="text-slate-700 font-medium">🔒 Safe & secure</p>
              <p>
                Transactions use industry-standard encryption. Your details are
                never stored.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
