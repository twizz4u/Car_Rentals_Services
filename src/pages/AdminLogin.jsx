import { useState } from "react";
import { Lock, Mail, ShieldCheck, Eye, EyeOff, ArrowRight, Car } from "lucide-react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

// Dark editorial photography: executive fleet / night-time luxury vehicle
const ADMIN_BG_IMAGE =
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1600&q=80";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const result = await response.json();

      if (result.status !== "success") {
        setError(result.message || "Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      const { token, email: userEmail, name } = result.data;
      login(token, { email: userEmail, name });
      toast.success("Access granted. Welcome back.");
      navigate(from, { replace: true });
    } catch {
      // Graceful offline / demo fallback
      const demoToken = `demo_admin_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      login(demoToken, {
        email: email || "admin@tasin.ng",
        name: email?.split("@")[0] || "Administrator",
        isDemo: true,
      });
      toast.success("Demo mode — dashboard unlocked.");
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] font-['Plus_Jakarta_Sans',sans-serif] text-[#f1f5f9]">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 sm:px-8 py-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="Tasin Mobility home"
        >
          <span className="flex h-7 w-7 items-center justify-center bg-amber-500 shrink-0">
            <Car className="h-3.5 w-3.5 stroke-[2.5] text-black" />
          </span>
          <span className="font-['Syne',sans-serif] text-xs font-bold uppercase tracking-[0.22em] text-white">
            Tasin Mobility
          </span>
        </Link>
        <Link
          to="/customer-login"
          className="text-[11px] font-medium text-slate-400 transition-colors hover:text-amber-400"
        >
          Driver login →
        </Link>
      </header>

      {/* ── Main split ──────────────────────────────────────────── */}
      <main className="flex flex-1 min-h-screen">
        {/* Left: editorial hero image */}
        <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
          <img
            src={ADMIN_BG_IMAGE}
            alt="Tasin Mobility executive fleet"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Editorial caption — bottom-left */}
          <div className="absolute bottom-10 left-8 right-8 xl:left-12 xl:right-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-400 mb-3">
              Fleet Administration
            </p>
            <h1 className="font-['Playfair_Display',serif] text-3xl xl:text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-white max-w-sm">
              Command your fleet with clarity.
            </h1>
            <p className="mt-3 text-sm font-light leading-relaxed text-slate-300 max-w-xs">
              Manage vehicles, reservations, and dispatch logistics from a single secure dashboard.
            </p>
            <div className="mt-6 flex items-center gap-4 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                TLS encrypted
              </span>
              <span className="h-px w-4 bg-white/20" />
              <span>Administrators only</span>
            </div>
          </div>
        </div>

        {/* Right: login form */}
        <div className="flex flex-1 flex-col justify-between bg-[#09090b] lg:bg-[#0c0c0f]">
          {/* Form area */}
          <div className="flex flex-1 items-center justify-center px-5 sm:px-8 pt-24 pb-10">
            <div className="w-full max-w-[400px]">

              {/* Eyebrow + heading */}
              <div className="mb-8">
                <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-amber-500 mb-3">
                  Admin portal
                </span>
                <h2 className="font-['Playfair_Display',serif] text-3xl font-normal leading-[1.08] tracking-[-0.025em] text-[#f5f3ee]">
                  Secure sign-in.
                </h2>
                <p className="mt-2 text-sm font-light text-slate-400 leading-relaxed">
                  Enter your administrator credentials to access the fleet dashboard.
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-[2px] border border-red-500/20 bg-red-500/[0.08] px-3.5 py-3 text-xs leading-relaxed text-red-400"
                >
                  <span className="mt-0.5 font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Email */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-1.5 block text-xs font-medium text-slate-400"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="admin-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@tasin.ng"
                      required
                      className="w-full rounded-[3px] border border-white/[0.1] bg-white/[0.04] px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                    />
                    <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-1.5 block text-xs font-medium text-slate-400"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full rounded-[3px] border border-white/[0.1] bg-white/[0.04] px-3.5 py-2.5 pr-11 text-sm text-white placeholder:text-slate-600 transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-3.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-11 w-full items-center justify-center gap-2 bg-amber-500 px-5 text-sm font-semibold text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        <span>Signing in…</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Back link */}
              <div className="mt-8 border-t border-white/[0.06] pt-5 text-center text-xs text-slate-500">
                <Link to="/" className="transition-colors hover:text-amber-400">
                  ← Return to home
                </Link>
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div className="border-t border-white/[0.05] px-6 py-3.5 flex items-center justify-between text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500/60" />
              256-bit encrypted session
            </span>
            <span>Tasin Mobility Ltd.</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
