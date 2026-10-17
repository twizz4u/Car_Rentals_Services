import { useState } from "react";
import { Lock, Mail, ShieldCheck, Eye, EyeOff, ArrowRight, Car, AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

// Local fleet photography (bundled, base-path safe): the same executive
// S-Class frame the home hero showcases, graded like the customer auth stage.
const ADMIN_STAGE_IMAGE =
  `${import.meta.env.BASE_URL}cars/hero_mercedes_s580.jpg`;

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
      // 1) Only a genuine network failure unlocks demo mode. Server
      //    responses never reach this catch, so a real API error can no
      //    longer masquerade as a successful demo login.
      let response;
      try {
        response = await fetch("http://127.0.0.1:8000/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: email.trim(), password }),
        });
      } catch {
        const demoToken = `demo_admin_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        login(demoToken, {
          email: email || "admin@tasin.ng",
          name: email?.split("@")[0] || "Administrator",
          isDemo: true,
        });
        toast.success("Demo mode — dashboard unlocked.");
        navigate(from, { replace: true });
        return;
      }

      // 2) Error responses may be HTML (e.g. a Laravel error page), which
      //    would throw on .json(). Treat that as a failed login, not offline.
      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || result?.status !== "success") {
        setError(
          result?.message ||
            "Invalid administrator credentials or access revoked.",
        );
        return;
      }

      // 3) Accept the token from any shape the API may return, so a
      //    reshaped payload can never throw and silently grant demo access.
      const token = result.token || result.data?.token || result.access_token;
      const profile = result.data?.user || result.data || result.user || {};

      if (!token) {
        setError("Sign-in succeeded but no session token was returned.");
        return;
      }

      login(token, {
        email: profile.email || email.trim(),
        name: profile.name,
        role: profile.role,
      });
      toast.success("Access granted. Welcome back.");
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400/30 selection:text-amber-200">
      <div className="min-h-screen grid lg:grid-cols-12 relative overflow-hidden">
        {/* LEFT STAGE: Cinematic Editorial Canvas (7 cols on large screens) */}
        <section className="relative lg:col-span-7 hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-white/[0.06]">
          {/* Fleet photography with bespoke grading */}
          <div className="absolute inset-0 z-0">
            <img
              src={ADMIN_STAGE_IMAGE}
              alt="Mercedes-Benz S-Class — Tasin executive fleet"
              className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.08] saturate-[1.05]"
            />
            {/* Film gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/40 to-[#090b10]/75" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#090b10]/20 to-[#090b10]" />
            {/* Ambient horizon illumination */}
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#090b10] to-transparent" />
          </div>

          {/* Top Bar on Stage */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group" aria-label="Tasin Mobility home">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5 text-slate-950 stroke-[2.2]" />
              </div>
              <span className="font-['Syne',sans-serif] font-bold text-sm tracking-[0.2em] text-white uppercase">
                Tasin Mobility
              </span>
            </Link>
          </div>

          {/* Center-Bottom Narrative */}
          <div className="relative z-10 max-w-xl pb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-400 mb-4">
              Fleet Administration
            </p>
            <h1 className="font-['Playfair_Display',serif] text-4xl xl:text-5xl font-normal text-white leading-[1.08] tracking-[-0.02em]">
              Command your fleet,{" "}
              <span className="font-['Instrument_Serif',serif] italic font-normal text-amber-300 tracking-normal block text-4xl xl:text-[3.25rem] mt-1">
                with total clarity.
              </span>
            </h1>
            <p className="mt-5 text-sm xl:text-base text-slate-300/90 leading-relaxed font-light">
              Manage vehicles, reservations, and dispatch logistics from a
              single secure dashboard — verified figures, live availability,
              no guesswork.
            </p>
          </div>

          {/* Bottom Trust Row on Stage */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              TLS encrypted session
            </span>
            <span>Administrators only</span>
          </div>
        </section>

        {/* RIGHT STAGE: The Staff Console (5 cols) */}
        <section className="lg:col-span-5 flex flex-col justify-between bg-[#0b0e14] relative z-10 min-h-screen">
          {/* Subtle Ambient Glow at Top Edge */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

          {/* Top Console Bar */}
          <header className="px-6 sm:px-10 pt-7 pb-4 flex items-center justify-between border-b border-white/[0.06]">
            <Link to="/" className="flex items-center gap-2.5 lg:hidden" aria-label="Tasin Mobility home">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600">
                <Car className="h-3.5 w-3.5 text-slate-950 stroke-[2.2]" />
              </span>
              <span className="font-['Syne',sans-serif] text-xs font-bold uppercase tracking-[0.2em] text-white">
                Tasin Mobility
              </span>
            </Link>
            <Link
              to="/customer-login"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors ml-auto"
            >
              <span>Driver login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </header>

          {/* Main Form Body */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 max-w-md w-full mx-auto">
            {/* Mode Indicator (mirrors the customer console tabs) */}
            <div className="flex border-b border-white/[0.08] mb-5">
              <span
                aria-current="page"
                className="pb-3 text-xs tracking-wider uppercase font-semibold text-amber-400 transition-all relative"
              >
                <span>Staff Sign In</span>
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
              </span>
            </div>

            {/* Headline and Context */}
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-500 mb-2.5">
                Admin portal
              </p>
              <h2 className="font-['Playfair_Display',serif] text-4xl font-normal leading-[1.06] tracking-[-0.025em] text-[#f5f3ee]">
                Secure sign-in.
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed font-light">
                Enter your administrator credentials to access the fleet dashboard.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300" role="alert">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-[11px] uppercase tracking-[0.14em] font-bold text-slate-300 mb-1.5"
                >
                  Email Address
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
                    className="w-full px-3.5 py-3 rounded-lg bg-black/40 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all"
                  />
                  <Mail className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-[11px] uppercase tracking-[0.14em] font-bold text-slate-300 mb-1.5"
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
                    className="w-full pl-3.5 pr-10 py-3 rounded-lg bg-black/40 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-light">
                  Trouble signing in?
                </span>
                <a
                  href="tel:+2348008274666"
                  className="text-xs font-medium text-slate-300 transition-colors hover:text-amber-400"
                >
                  Contact support
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </span>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back link */}
            <div className="mt-6 border-t border-white/[0.06] pt-4 text-center text-xs text-slate-500">
              <Link to="/" className="transition-colors hover:text-amber-400">
                ← Return to home
              </Link>
            </div>
          </div>

          {/* Footer of the Console */}
          <footer className="px-6 sm:px-10 py-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} Tasin Mobility Fleet</span>
            <div className="flex items-center gap-3">
              <Link
                to="/customer-login"
                className="hover:text-amber-400 transition-colors"
              >
                Driver login
              </Link>
              <span>•</span>
              <a
                href="tel:+2348008274666"
                className="hover:text-amber-400 transition-colors"
              >
                Support
              </a>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;
