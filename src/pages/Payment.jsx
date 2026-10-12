import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  CheckCircle2,
  CreditCard,
  KeyRound,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

// Helper to parse price string
const parsePrice = (priceStr) => {
  if (typeof priceStr === "number") return priceStr;
  const match = priceStr?.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
};

// Fallback image helper
const getVehicleImage = (image, name = "", model = "") => {
  if (image && !image.includes("placeholder")) {
    return image.startsWith("/") ? image : `/${image}`;
  }
  const lower = (name + " " + model).toLowerCase();
  if (lower.includes("bmw")) return "/cars/BMW_7.webp";
  if (lower.includes("cadillac")) return "/cars/Cadillac.webp";
  if (lower.includes("genesis")) return "/cars/Genesis.webp";
  if (lower.includes("lexus")) return "/cars/Lexus.webp";
  if (lower.includes("lincoln")) return "/cars/Lincoln_Navigator.webp";
  if (lower.includes("porsche")) return "/cars/Porsche.webp";
  if (lower.includes("volvo")) return "/cars/Volvo.webp";
  if (lower.includes("gmc")) return "/cars/GMC_Sierra.webp";
  return "/cars/Volvo.webp";
};

export const PaymentPage = () => {
  const { items, totalItems, totalAmount, clearCart, updateDuration, removeFromCart } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    hubLocation: "Lagos - Victoria Island / Ikoyi Hub",
    handoverMode: "keyless", // 'keyless' | 'chauffeur'
    cardNo: "",
    expiry: "",
    ccv: "",
    billingAddress: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' | 'transfer'
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [receiptTotal, setReceiptTotal] = useState(0);

  const update = (key) => (e) => {
    setForm((s) => ({ ...s, [key]: e.target.value }));
  };

  // Card formatting
  const handleCardNoChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    setForm((s) => ({ ...s, cardNo: val }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setForm((s) => ({ ...s, expiry: val }));
  };

  const isDigits = /^[0-9]+$/;

  const valid = {
    fullName: form.fullName.trim().length > 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    phone: form.phone.trim().length >= 10,
    cardNo: paymentMethod === "transfer" ? true : isDigits.test(form.cardNo) && form.cardNo.length === 16,
    ccv: paymentMethod === "transfer" ? true : isDigits.test(form.ccv) && form.ccv.length === 3,
    billingAddress: form.billingAddress.trim().length > 4,
  };

  const formValid = Object.values(valid).every(Boolean) && totalItems > 0;

  // Progress indicator — derived purely from the existing form state above.
  const detailsComplete =
    valid.fullName && valid.email && valid.phone && valid.billingAddress;
  const paymentBegun =
    paymentMethod === "transfer" ||
    form.cardNo.length > 0 ||
    form.expiry.length > 0 ||
    form.ccv.length > 0;
  const paymentComplete = detailsComplete && valid.cardNo && valid.ccv;
  const steps = [
    { n: "01", label: "Your details", done: detailsComplete },
    { n: "02", label: "Handover", done: detailsComplete && paymentBegun },
    { n: "03", label: "Payment", done: paymentComplete },
  ];
  const activeStep = steps.findIndex((step) => !step.done);

  // Calculate financial totals
  const { subtotal, serviceFee, tax, total } = useMemo(() => {
    const sub = totalAmount;
    const fee = sub ? Math.round(sub * 0.02) : 0;
    const t = sub ? Math.round(sub * 0.075) : 0;
    return { subtotal: sub, serviceFee: fee, tax: t, total: sub + fee + t };
  }, [totalAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!formValid) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setBookingRef(`TM-${Math.floor(100000 + Math.random() * 900000)}`);
      setReceiptTotal(total);
      setSuccess(true);
      clearCart();
    }, 1600);
  };

  // Success State View
  if (success) {
    return (
      <div className="relative min-h-screen bg-[#06070a] text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between isolate overflow-x-hidden">
        {/* Ambient luxury background glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[550px] w-[950px] rounded-full bg-gradient-to-b from-amber-500/[0.08] via-amber-600/[0.03] to-transparent blur-[140px]" />
          <div className="absolute bottom-10 -right-32 h-[600px] w-[600px] rounded-full bg-amber-600/[0.05] blur-[150px]" />
        </div>

        {/* Navigation Bar */}
        <header className="border-b border-white/[0.06] bg-[#06070a]/80 px-6 lg:px-10 py-4 flex items-center justify-between backdrop-blur-md">
          <Link to="/" className="flex items-center gap-3 group focus:outline-none" aria-label="Tasin Mobility home">
            <span className="flex h-8 w-8 items-center justify-center bg-amber-500">
              <Car className="h-4 w-4 stroke-[2.4] text-black" />
            </span>
            <span className="font-['Syne',sans-serif] text-sm font-bold uppercase tracking-[0.22em] text-white">
              Tasin Mobility
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-amber-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to vehicles
          </Link>
        </header>

        {/* Confirmation Stage */}
        <main className="max-w-3xl mx-auto px-4 py-16 w-full">
          <div className="relative overflow-hidden rounded-[4px] border border-white/[0.1] bg-[#0a0b0e] px-6 py-10 sm:px-10 sm:py-12">
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div>
                <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
                  Reservation confirmed
                </span>
                <h1 className="mt-4 font-['Playfair_Display',serif] text-3xl font-normal leading-[1.05] tracking-[-0.03em] text-[#f5f3ee] sm:text-4xl">
                  You’re all set.
                </h1>
                <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-slate-400">
                  Your reservation is confirmed. We’ve sent the details to your email and our team
                  will be in touch shortly to arrange the handover.
                </p>
              </div>
            </div>

            {/* Reservation summary */}
            <dl className="mx-auto mt-9 max-w-lg border-y border-white/[0.06] text-sm">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-3.5">
                <dt className="text-slate-500">Booking reference</dt>
                <dd className="font-medium tracking-wide text-amber-500">{bookingRef}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-3.5">
                <dt className="text-slate-500">Handover location</dt>
                <dd className="text-right font-medium text-slate-200">{form.hubLocation}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-3.5">
                <dt className="text-slate-500">Handover</dt>
                <dd className="font-medium text-slate-200">
                  {form.handoverMode === "keyless" ? "Keyless pickup" : "Chauffeur handover"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-slate-500">Total paid</dt>
                <dd className="font-semibold text-white">₦{receiptTotal.toLocaleString()}</dd>
              </div>
            </dl>

            {/* Action buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
              >
                Browse the fleet
              </Link>
              <Link
                to="/customer-login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                View your bookings
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] bg-[#07080b] py-5 text-center text-xs text-slate-500">
          Tasin Mobility Nigeria Limited · Support: +234 (0) 800 827 4666
        </footer>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#06070a] text-slate-300 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-500/30 selection:text-white isolate overflow-x-hidden">
      {/* Ambient luxury background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* Top ambient warm gold glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[550px] w-[950px] rounded-full bg-gradient-to-b from-amber-500/[0.08] via-amber-600/[0.03] to-transparent blur-[140px]" />
        {/* Mid-left subtle amber illumination */}
        <div className="absolute top-[35%] -left-36 h-[500px] w-[500px] rounded-full bg-amber-500/[0.04] blur-[130px]" />
        {/* Bottom-right warm reflection */}
        <div className="absolute bottom-10 -right-32 h-[600px] w-[600px] rounded-full bg-amber-600/[0.05] blur-[150px]" />
        {/* Radial depth vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.03),_transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[#06070a]/80 px-4 py-4 backdrop-blur-md sm:px-8">
        <Link to="/" className="flex items-center gap-3 group focus:outline-none" aria-label="Tasin Mobility home">
          <span className="flex h-8 w-8 items-center justify-center bg-amber-500">
            <Car className="h-4 w-4 stroke-[2.4] text-black" />
          </span>
          <span className="font-['Syne',sans-serif] text-sm font-bold uppercase tracking-[0.22em] text-white">
            Tasin Mobility
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 text-[11px] font-medium text-slate-500 sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure payment
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-amber-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to vehicles
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-12">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500">
            Checkout
          </span>
          <h1 className="mt-3 font-['Playfair_Display',serif] text-4xl font-normal leading-[1.02] tracking-[-0.03em] text-[#f5f3ee] sm:text-5xl">
            Complete your reservation.
          </h1>
        </div>

        {totalItems === 0 ? (
          <div className="mx-auto mt-16 max-w-md py-10 text-center">
            <h2 className="font-['Playfair_Display',serif] text-3xl font-normal leading-tight tracking-[-0.02em] text-[#f5f3ee]">
              Your reservation is empty.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-slate-400">
              Browse the fleet to choose a vehicle, then come back here to confirm.
            </p>
            <Link
              to="/"
              className="mt-7 inline-flex items-center gap-2 bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-400"
            >
              <span>Browse vehicles</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left column: details → handover → payment */}
            <div className="lg:col-span-7">
              <div className="rounded-[4px] border border-white/[0.06] bg-[#0a0b0e] px-5 py-7 sm:px-8 sm:py-9">
                {/* Progress */}
                <ol className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {steps.map((step, i) => (
                    <li key={step.label} className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium ${
                          i === activeStep
                            ? "text-amber-500"
                            : step.done
                              ? "text-slate-300"
                              : "text-slate-600"
                        }`}
                      >
                        {step.done ? (
                          <Check className="h-3.5 w-3.5 text-amber-500" />
                        ) : (
                          <span className={i === activeStep ? "text-amber-500" : "text-slate-600"}>
                            {step.n}
                          </span>
                        )}
                        <span>{step.label}</span>
                      </span>
                      {i < steps.length - 1 && (
                        <span className="h-px w-6 bg-white/[0.12]" aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ol>

                {/* Your details */}
                <section className="mt-8 border-t border-white/[0.06] pt-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-['Playfair_Display',serif] text-2xl font-normal leading-[1.1] tracking-[-0.02em] text-[#f5f3ee] sm:text-3xl">
                      Your details
                    </h2>
                    <span className="text-[11px] text-slate-500">All fields required</span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="fullName">
                        Full name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="e.g. Oluwaseun Adeleke"
                        value={form.fullName}
                        onChange={update("fullName")}
                        className={`w-full rounded-[3px] border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none ${
                          submitted && !valid.fullName ? "border-red-500/70" : "border-white/[0.1]"
                        }`}
                      />
                      {submitted && !valid.fullName && (
                        <span className="mt-1.5 block text-[11px] text-red-400">Legal name is required</span>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="email">
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        value={form.email}
                        onChange={update("email")}
                        className={`w-full rounded-[3px] border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none ${
                          submitted && !valid.email ? "border-red-500/70" : "border-white/[0.1]"
                        }`}
                      />
                      {submitted && !valid.email && (
                        <span className="mt-1.5 block text-[11px] text-red-400">Valid email required</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="phone">
                        Phone number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={form.phone}
                        onChange={update("phone")}
                        className={`w-full rounded-[3px] border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none ${
                          submitted && !valid.phone ? "border-red-500/70" : "border-white/[0.1]"
                        }`}
                      />
                      {submitted && !valid.phone && (
                        <span className="mt-1.5 block text-[11px] text-red-400">Valid phone number required</span>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="billingAddress">
                        Billing address
                      </label>
                      <input
                        id="billingAddress"
                        type="text"
                        placeholder="Residential or office address"
                        value={form.billingAddress}
                        onChange={update("billingAddress")}
                        className={`w-full rounded-[3px] border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none ${
                          submitted && !valid.billingAddress ? "border-red-500/70" : "border-white/[0.1]"
                        }`}
                      />
                      {submitted && !valid.billingAddress && (
                        <span className="mt-1.5 block text-[11px] text-red-400">Address required for insurance</span>
                      )}
                    </div>
                  </div>
                </section>

                {/* Handover */}
                <section className="mt-8 border-t border-white/[0.06] pt-8">
                  <h2 className="font-['Playfair_Display',serif] text-2xl font-normal leading-[1.1] tracking-[-0.02em] text-[#f5f3ee] sm:text-3xl">
                    Handover
                  </h2>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="hubLocation">
                        Location
                      </label>
                      <select
                        id="hubLocation"
                        value={form.hubLocation}
                        onChange={update("hubLocation")}
                        className="w-full cursor-pointer rounded-[3px] border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white transition-colors focus:border-amber-500 focus:outline-none"
                      >
                        <option value="Lagos - Victoria Island / Ikoyi Hub" className="bg-[#0a0b0e]">
                          Lagos — VI / Ikoyi / Lekki Hub
                        </option>
                        <option value="Lagos - MMIA Airport Runway Delivery" className="bg-[#0a0b0e]">
                          Lagos — MMIA Airport Executive Terminal
                        </option>
                        <option value="Abuja - Central Business District / Maitama Hub" className="bg-[#0a0b0e]">
                          Abuja — CBD / Maitama Diplomatic Hub
                        </option>
                        <option value="Port Harcourt - Trans-Amadi Hub" className="bg-[#0a0b0e]">
                          Port Harcourt — Trans-Amadi Hub
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-400">Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setForm((s) => ({ ...s, handoverMode: "keyless" }))}
                          className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                            form.handoverMode === "keyless"
                              ? "bg-amber-500 text-black font-semibold"
                              : "border border-white/[0.14] text-slate-400 hover:border-amber-500 hover:text-amber-500"
                          }`}
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span>Keyless</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setForm((s) => ({ ...s, handoverMode: "chauffeur" }))}
                          className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                            form.handoverMode === "chauffeur"
                              ? "bg-amber-500 text-black font-semibold"
                              : "border border-white/[0.14] text-slate-400 hover:border-amber-500 hover:text-amber-500"
                          }`}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Chauffeur</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment */}
                <section className="mt-8 border-t border-white/[0.06] pt-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="font-['Playfair_Display',serif] text-2xl font-normal leading-[1.1] tracking-[-0.02em] text-[#f5f3ee] sm:text-3xl">
                      Payment
                    </h2>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          paymentMethod === "card"
                            ? "bg-amber-500 text-black font-semibold"
                            : "border border-white/[0.14] text-slate-400 hover:border-amber-500 hover:text-amber-500"
                        }`}
                      >
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("transfer")}
                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          paymentMethod === "transfer"
                            ? "bg-amber-500 text-black font-semibold"
                            : "border border-white/[0.14] text-slate-400 hover:border-amber-500 hover:text-amber-500"
                        }`}
                      >
                        Bank transfer
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="cardNo">
                          Card number
                        </label>
                        <div className="relative">
                          <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                          <input
                            id="cardNo"
                            type="text"
                            inputMode="numeric"
                            placeholder="0000 0000 0000 0000"
                            value={form.cardNo}
                            onChange={handleCardNoChange}
                            maxLength={16}
                            className={`w-full rounded-[3px] border bg-white/[0.03] py-2.5 pl-10 pr-3.5 text-sm tracking-wider text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none ${
                              submitted && !valid.cardNo ? "border-red-500/70" : "border-white/[0.1]"
                            }`}
                          />
                        </div>
                        {submitted && !valid.cardNo && (
                          <span className="mt-1.5 block text-[11px] text-red-400">Valid 16-digit card required</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="expiry">
                            Expiry (MM/YY)
                          </label>
                          <input
                            id="expiry"
                            type="text"
                            placeholder="12/28"
                            value={form.expiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className="w-full rounded-[3px] border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-400" htmlFor="ccv">
                            Security code
                          </label>
                          <input
                            id="ccv"
                            type="password"
                            inputMode="numeric"
                            placeholder="123"
                            value={form.ccv}
                            onChange={update("ccv")}
                            maxLength={3}
                            className={`w-full rounded-[3px] border bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none ${
                              submitted && !valid.ccv ? "border-red-500/70" : "border-white/[0.1]"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-[3px] border border-white/[0.08] bg-white/[0.02] p-4">
                      <p className="text-xs leading-relaxed text-slate-400">
                        After you confirm, our bank details will be shown here. Your reservation is
                        secured as soon as the transfer is received.
                      </p>
                    </div>
                  )}

                  {/* Primary Confirmation Action — Moved to Left Column immediately after payment fields */}
                  <div className="mt-8 pt-2">
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex h-12 w-full items-center justify-center gap-2 bg-amber-500 px-6 text-sm font-semibold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      {processing ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          <span>Confirming…</span>
                        </>
                      ) : (
                        <span>Confirm reservation — ₦{total.toLocaleString()}</span>
                      )}
                    </button>
                  </div>
                </section>
              </div>
            </div>

            {/* Right column: reservation review / receipt summary */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <div className="rounded-[4px] border border-white/[0.1] bg-[#0a0b0e] p-5 space-y-4 sm:p-6">
                <div className="flex items-end justify-between gap-3 border-b border-white/[0.06] pb-4">
                  <div>
                    <h2 className="font-['Playfair_Display',serif] text-xl font-normal leading-tight tracking-[-0.02em] text-[#f5f3ee] sm:text-2xl">
                      Your reservation
                    </h2>
                    <span className="mt-1 block text-xs text-slate-500">
                      {totalItems} {totalItems === 1 ? "vehicle" : "vehicles"}
                    </span>
                  </div>
                </div>

                {/* Vehicle lines */}
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {items.map((item) => {
                    const pricePerDay = parsePrice(item.car.loanPrice || item.car.price);
                    const itemTotal = pricePerDay * item.duration;
                    const carImg = getVehicleImage(item.car.image, item.car.name, item.car.model);

                    return (
                      <div
                        key={item.car.name}
                        className="rounded-[3px] border border-white/[0.08] bg-white/[0.02] p-3.5 space-y-3"
                      >
                        <div className="flex gap-3.5 items-center">
                          <img
                            src={carImg}
                            alt={item.car.name}
                            className="h-14 w-20 shrink-0 rounded-[2px] border border-white/[0.08] bg-white/[0.04] object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-white">
                              {item.car.name}
                            </h3>
                            <p className="truncate text-xs font-light text-slate-400">
                              {item.car.model || item.car.category}
                            </p>
                            <span className="mt-0.5 block text-xs font-medium text-amber-500">
                              ₦{pricePerDay.toLocaleString()} / day
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.car.name)}
                            title="Remove"
                            className="p-1 text-slate-500 transition-colors hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Duration & line total */}
                        <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-xs">
                          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.12] p-0.5">
                            <button
                              type="button"
                              onClick={() => updateDuration(item.car.name, item.duration - 1)}
                              disabled={item.duration <= 1}
                              className="flex h-5 w-5 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold text-white">
                              {item.duration}d
                            </span>
                            <button
                              type="button"
                              onClick={() => updateDuration(item.car.name, item.duration + 1)}
                              className="flex h-5 w-5 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/[0.08] cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-semibold text-white">
                            ₦{itemTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price breakdown */}
                <div className="space-y-2.5 border-t border-white/[0.06] pt-4 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Vehicle</span>
                    <span className="text-slate-200">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Service / logistics</span>
                    <span className="text-slate-200">₦{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taxes & fees</span>
                    <span className="text-slate-200">₦{tax.toLocaleString()}</span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-white/[0.06] pt-3.5">
                    <span className="text-sm font-medium text-white">Total</span>
                    <span className="text-lg font-semibold text-white">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default PaymentPage;
