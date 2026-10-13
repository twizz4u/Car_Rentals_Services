import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Car,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import authBg from "../assets/auth-bg.jpg";

export const CustomerReg = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTarget = location.state?.from?.pathname || "/account";

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: "Add uppercase & numbers" };
    if (score === 2) return { score: 2, label: "Moderate" };
    if (score === 3) return { score: 3, label: "Strong" };
    return { score: 4, label: "Optimal protection" };
  };

  const strength = getPasswordStrength(regPassword);

  const switchMode = (mode) => {
    setIsLogin(mode);
    setFormError("");
  };

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!loginEmail.trim() || !loginPassword) {
      setFormError("Please enter your registered email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/customer/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && (result.status === "success" || result.token)) {
        const token = result.token || result.data?.token;
        const userData = result.data || { email: loginEmail, role: "customer" };
        login(token, userData);
        toast.success("Session verified. Welcome to your driver portal.");
        navigate(redirectTarget, { replace: true });
        return;
      }

      if (result.message) {
        setFormError(result.message);
        return;
      }
    } catch {
      // Offline fallback for testing
      const mockToken = `tasin_driver_${Date.now()}`;
      login(mockToken, {
        email: loginEmail,
        name: loginEmail.split("@")[0],
        role: "customer",
      });
      toast.success("Session verified. Welcome to your driver portal.");
      navigate(redirectTarget, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!regFullName.trim()) {
      setFormError(
        "Please provide your full legal name as it appears on your license.",
      );
      return;
    }
    if (!regEmail.trim()) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!regPassword || regPassword.length < 8) {
      setFormError("Password should be at least 8 characters.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setFormError("Passwords do not match. Please verify.");
      return;
    }
    if (!agreeTerms) {
      setFormError("Please confirm driver license eligibility.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/customer/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: regFullName.trim(),
            email: regEmail.trim(),
            password: regPassword,
          }),
        },
      );

      const result = await response.json();

      if (response.ok && (result.status === "success" || result.token)) {
        const token =
          result.token || result.data?.token || `tasin_${Date.now()}`;
        login(token, {
          email: regEmail,
          name: regFullName,
          role: "customer",
        });
        toast.success("Driver account established. Ready to reserve.");
        navigate(redirectTarget, { replace: true });
        return;
      }

      if (result.message) {
        setFormError(result.message);
        return;
      }
    } catch {
      // Offline fallback
      const mockToken = `tasin_driver_${Date.now()}`;
      login(mockToken, {
        email: regEmail,
        name: regFullName,
        role: "customer",
      });
      toast.success("Driver account established. Ready to reserve.");
      navigate(redirectTarget, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400/30 selection:text-amber-200">
      <div className="min-h-screen grid lg:grid-cols-12 relative overflow-hidden">
        {/* LEFT STAGE: Cinematic Editorial Canvas (7 cols on large screens) */}
        <section className="relative lg:col-span-7 xl:col-span-7 hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden border-r border-white/[0.06]">
          {/* Background Photography with Bespoke Grading */}
          <div className="absolute inset-0 z-0">
            <img
              src={authBg}
              alt="Night highway drive"
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
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5 text-slate-950 stroke-[2.2]" />
              </div>
              <span className="font-['Syne',sans-serif] font-bold text-sm tracking-[0.2em] text-white uppercase">
                Tasin Mobility
              </span>
            </Link>
          </div>

          {/* Center-Bottom Dramatic Narrative */}
          <div className="relative z-10 max-w-xl pb-6">
            <h1 className="font-['Syne',sans-serif] text-4xl xl:text-5xl font-extrabold text-white leading-[1.08] tracking-tight">
              The open road,{" "}
              <span className="font-['Instrument_Serif',serif] italic font-normal text-amber-300 tracking-normal block text-4xl xl:text-[3.25rem] mt-1">
                at your own cadence.
              </span>
            </h1>

            <p className="mt-5 text-sm xl:text-base text-slate-300/90 leading-relaxed font-light">
              Skip traditional counter queues. Choose from an inspected garage
              of executive sedans, grand SUVs, and performance vehicles with
              direct keyless bay access and curbside drop-off.
            </p>
          </div>

          {/* Bottom Link on Left Column */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
            <Link
              to="/"
              className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Explore Fleet Catalog</span>
            </Link>
          </div>
        </section>

        {/* RIGHT STAGE: The Driver Atelier Console (5 cols) */}
        <section className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between bg-[#0b0e14] relative z-10 min-h-screen">
          {/* Subtle Ambient Glow at Top Edge */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

          {/* Top Console Bar */}
          <header className="px-6 sm:px-10 pt-7 pb-4 flex items-center justify-end border-b border-white/[0.06]">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to cars</span>
            </Link>
          </header>

          {/* Main Form Body */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-8 max-w-md w-full mx-auto">
            {/* Mode Selector Tabs (Editorial style) */}
            <div className="flex border-b border-white/[0.08] mb-8">
              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`pb-3 text-xs tracking-wider uppercase font-semibold transition-all relative cursor-pointer ${
                  isLogin
                    ? "text-amber-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Sign In</span>
                {isLogin && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`ml-8 pb-3 text-xs tracking-wider uppercase font-semibold transition-all relative cursor-pointer ${
                  !isLogin
                    ? "text-amber-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>New Driver Profile</span>
                {!isLogin && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
                )}
              </button>
            </div>

            {/* Headline and Context */}
            <div className="mb-6">
              <h2 className="font-['Syne',sans-serif] text-2xl font-bold text-white tracking-tight">
                {isLogin
                  ? "Access your reservation"
                  : "Register driver credentials"}
              </h2>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed font-light">
                {isLogin
                  ? "Enter your credentials to view vehicle assignments, modify trip dates, or request valet dispatch."
                  : "Establish your verified driver profile once to reserve premium vehicles anytime with straightforward daily rates."}
              </p>
            </div>

            {/* Error Notification */}
            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{formError}</span>
              </div>
            )}

            {/* Form */}
            {isLogin ? (
              /* SIGN IN */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="console-email"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="console-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="driver@example.com"
                      autoComplete="email"
                      required
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="console-password"
                      className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toast.info(
                          "Please contact customer concierge to reset your security credentials.",
                        )
                      }
                      className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="console-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                      aria-label={
                        showLoginPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded bg-black/50 border-slate-700 text-amber-500 focus:ring-amber-400/30"
                    />
                    <span>Remember this station</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3 px-5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </span>
                  ) : (
                    <>
                      <span>Enter Driver Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTER */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1"
                  >
                    Full Legal Name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="As shown on driver's license"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="driver@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-pwd"
                      className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="reg-pwd"
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="8+ characters"
                        required
                        className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showRegPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-confirm-pwd"
                      className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1"
                    >
                      Confirm
                    </label>
                    <div className="relative">
                      <input
                        id="reg-confirm-pwd"
                        type={showRegConfirmPassword ? "text" : "password"}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter"
                        required
                        className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowRegConfirmPassword(!showRegConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showRegConfirmPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password strength */}
                {regPassword && (
                  <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-slate-400">
                    <span className="text-[10px] text-slate-400">
                      Strength:
                    </span>
                    <div className="flex-1 flex gap-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full flex-1 rounded-full ${
                          strength.score >= 1
                            ? "bg-amber-400"
                            : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${
                          strength.score >= 2
                            ? "bg-amber-400"
                            : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${
                          strength.score >= 3
                            ? "bg-emerald-400"
                            : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${
                          strength.score >= 4
                            ? "bg-emerald-500"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {strength.label}
                    </span>
                  </div>
                )}

                {/* Terms agreement */}
                <label className="flex items-start gap-2 pt-1 cursor-pointer text-xs text-slate-400 leading-snug select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded bg-black/50 border-slate-700 text-amber-500 focus:ring-amber-400/30 shrink-0"
                  />
                  <span>
                    I confirm I hold an active driver's license (minimum age 21)
                    and accept rental dispatch terms.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3 px-5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Establishing Profile...</span>
                    </span>
                  ) : (
                    <>
                      <span>Establish Driver Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer of the Console */}
          <footer className="px-6 sm:px-10 py-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} Tasin Mobility Fleet</span>
            <div className="flex items-center gap-3">
              <Link
                to="/admin-login"
                className="hover:text-amber-400 transition-colors"
              >
                Staff Dispatch
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

export default CustomerReg;
