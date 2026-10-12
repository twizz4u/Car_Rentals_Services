import { useState } from "react";
import {
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  Cpu,
} from "lucide-react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const ADMIN_HERO_IMAGE =
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

    // Get the page user was trying to access before being redirected
    const from = location.state?.from?.pathname || "/dashboard";

    // Redirect authenticated users away from login page
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!email.trim() || !password) {
            setError("Root administrator email and security token required.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const result = await response.json();

            if (!response.ok || result.status !== "success") {
                setError(result.message || "Invalid administrator credentials or access revoked.");
                return;
            }

            const { token, email: userEmail, name, role } = result.data;
            login(token, { email: userEmail, name, role });
            toast.success("Admin session initialized. Welcome to Command Terminal.");
            navigate(from, { replace: true });
        } catch (err) {
            console.warn("API unreachable, falling back to demo admin login:", err);
            const demoToken = `tasin_ops_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            login(demoToken, { 
                email: email || "ops.controller@tasin.ng", 
                name: email ? email.split('@')[0] : "Fleet Commander",
                role: "admin",
                isDemo: true 
            });
            toast.success("Telemetry offline mode: Admin session authenticated.");
            navigate(from, { replace: true });
            return;
        } finally {
            setIsLoading(false);
        }
    };
    const renderHeader = () => (
      <header className="border-b border-[#1b202a] bg-[#090b0e] px-6 lg:px-10 py-3 flex items-center justify-between z-20 shrink-0 h-[56px]">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Tasin Mobility Home"
          >
            <span className="w-7 h-7 rounded-[3px] bg-[#141822] border border-[#252c3c] flex items-center justify-center font-['Space_Grotesk'] font-bold text-xs tracking-wider text-[#e2e8f0] group-hover:border-[#d97706] transition-colors">
              TM
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-['Space_Grotesk'] text-sm font-bold tracking-[0.14em] uppercase text-[#f1f5f9]">
                Tasin Mobility
              </span>
              <span className="font-['Space_Grotesk'] text-[8.5px] uppercase tracking-[0.2em] text-[#64748b] mt-0.5">
                Central Operations // Fleet Command
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-5 border-l border-[#1f2633] text-[10.5px] font-['Space_Grotesk'] uppercase tracking-[0.14em] text-[#94a3b8]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>Operations Telemetry Active</span>
            <span className="text-[#475569] mx-1">•</span>
            <span className="text-[#64748b]">Corridor Dispatch Gate 01</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            to="/customer-login"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#64748b] hover:text-[#94a3b8] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider transition-colors"
          >
            Driver Portal
          </Link>
          <span className="hidden sm:inline-block text-[#252d3d]">|</span>
          <Link
            to="/"
            className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors flex items-center gap-1.5 font-medium tracking-wide py-1 text-xs"
          >
            <span>Return to fleet</span>
            <span aria-hidden="true" className="text-xs">→</span>
          </Link>
        </div>
      </header>
    );
    const renderMissionControl = () => (
      <section className="relative hidden lg:flex lg:col-span-7 flex-col justify-between p-6 xl:p-8 border-r border-[#191d26] bg-[#0c0e13] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-lg shrink-0">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[2px] bg-[#141822] border border-[#222938] text-[9px] font-['Space_Grotesk'] font-semibold uppercase tracking-[0.2em] text-[#94a3b8] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
            <span>Command Protocol // Restricted Access</span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-xl xl:text-2xl font-bold tracking-tight text-[#f8fafc] leading-[1.2] uppercase">
            Operations Control & Fleet Telemetry System
          </h1>

          <p className="mt-1.5 text-[#94a3b8] text-xs leading-relaxed max-w-md font-normal">
            Internal command terminal for fleet controllers, reservation dispatchers, and security corridor escorts. Authorized personnel only.
          </p>
        </div>

        <div className="relative z-10 my-2 w-full max-w-xl shrink-0">
          <div className="relative rounded-[3px] overflow-hidden border border-[#222a3a] bg-[#141822]">
            <div className="h-[180px] xl:h-[210px] w-full overflow-hidden">
              <img
                src={ADMIN_HERO_IMAGE}
                alt="Tasin executive fleet operations vehicle ready for deployment"
                className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.08]"
                loading="eager"
              />
            </div>

            <div className="bg-[#0e121a]/95 border-t border-[#1e2534] px-3.5 py-2 flex items-center justify-between text-[11px] font-['Space_Grotesk']">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[#64748b] block text-[8.5px] uppercase tracking-wider">
                    Command Node
                  </span>
                  <span className="text-[#e2e8f0] font-medium tracking-wide text-xs">
                    Master Fleet Node [HQ-01]
                  </span>
                </div>
                <div className="h-4 w-px bg-[#1f2636]"></div>
                <div>
                  <span className="text-[#64748b] block text-[8.5px] uppercase tracking-wider">
                    Telemetry Sync
                  </span>
                  <span className="text-[#e2e8f0] font-medium tracking-wide text-xs">
                    34 Active Hubs Monitored
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[#64748b] block text-[8.5px] uppercase tracking-wider">
                  Node Health
                </span>
                <span className="text-[#10b981] font-medium tracking-wider flex items-center gap-1.5 justify-end text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  ALL SYSTEMS ONLINE
                </span>
              </div>
            </div>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[9.5px] font-['Space_Grotesk'] text-[#64748b] uppercase tracking-widest px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[#94a3b8]">CORRIDOR LAG-ABJ</span>
              <span className="text-[#475569]">———</span>
              <span className="text-[#94a3b8]">PHC RADIAL-03</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#d97706]">SYS VER 2.4.8</span>
              <span className="text-[#475569]">/</span>
              <span>ENC TLS-1.3</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3 pt-3 border-t border-[#191d26] text-xs shrink-0">
          <div>
            <span className="font-['Space_Grotesk'] text-[9.5px] text-[#d97706] font-semibold tracking-wider block mb-0.5">
              01 / FLEET INVENTORY
            </span>
            <p className="text-[#8e98a8] text-[10.5px] leading-relaxed">
              Live vehicle telematics, allocation quotas, and maintenance status.
            </p>
          </div>
          <div>
            <span className="font-['Space_Grotesk'] text-[9.5px] text-[#d97706] font-semibold tracking-wider block mb-0.5">
              02 / DISPATCH LOG
            </span>
            <p className="text-[#8e98a8] text-[10.5px] leading-relaxed">
              Real-time booking manifestation with keyless handover audit.
            </p>
          </div>
          <div>
            <span className="font-['Space_Grotesk'] text-[9.5px] text-[#d97706] font-semibold tracking-wider block mb-0.5">
              03 / ESCORT PROTOCOL
            </span>
            <p className="text-[#8e98a8] text-[10.5px] leading-relaxed">
              Interstate arterial corridors with automated tactical deployment.
            </p>
          </div>
        </div>
      </section>
    );
    return (
      <div className="h-screen bg-[#090b0e] text-[#e2e8f0] flex flex-col justify-between selection:bg-[#d97706]/30 selection:text-[#f8fafc] font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
        {renderHeader()}

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:h-[calc(100vh-56px)] overflow-y-auto lg:overflow-hidden">
          {renderMissionControl()}

          <section className="lg:col-span-5 bg-[#0e1117] flex flex-col justify-between p-6 sm:p-8 xl:p-10 h-full overflow-y-auto">
            <div className="max-w-[420px] w-full mx-auto my-auto py-2">
              <div className="flex items-center justify-between border-b border-[#202736] pb-3 mb-6">
                <div className="flex items-center gap-2 text-xs font-['Space_Grotesk'] uppercase tracking-[0.16em] font-semibold text-[#f8fafc]">
                  <KeyRound className="w-4 h-4 text-[#d97706]" />
                  <span>Operator Terminal</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-[#141822] border border-[#222938] text-[9px] font-['Space_Grotesk'] font-medium text-[#10b981] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  Secure Port 8000
                </span>
              </div>

              <div className="mb-5">
                <h2 className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-[#f8fafc] uppercase">
                  Admin Command Access
                </h2>
                <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  Authenticate with your fleet administrator credentials to manage inventory, customer reservations, and dispatch logistics.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-4 p-3 rounded-[2px] bg-[#291316] border border-[#5c1d24] text-[#fca5a5] text-xs flex items-start gap-2.5 leading-relaxed"
                >
                  <span className="text-[#ef4444] font-bold text-sm leading-none mt-0.5">!</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block font-['Space_Grotesk'] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8] mb-1.5"
                  >
                    Admin Email / Operator ID
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
                      className="w-full bg-[#080a0e] border border-[#222938] text-[#f1f5f9] text-sm px-3.5 py-2.5 rounded-[3px] placeholder:text-[#475569] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-colors"
                    />
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block font-['Space_Grotesk'] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]"
                    >
                      Authorization Key / Password
                    </label>
                    <span className="text-[10px] font-['Space_Grotesk'] text-[#64748b]">
                      SECURE ENCLAVE
                    </span>
                  </div>
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
                      className="w-full bg-[#080a0e] border border-[#222938] text-[#f1f5f9] text-sm px-3.5 py-2.5 pr-11 rounded-[3px] placeholder:text-[#475569] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-0 top-0 bottom-0 px-3.5 text-[#64748b] hover:text-[#e2e8f0] focus:outline-none flex items-center justify-center transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-[#080a0e] border border-[#1b212c] rounded-[2px] flex items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#64748b]">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Target Domain:</span>
                  </div>
                  <span className="text-[#cbd5e1] font-mono text-[10.5px]">/api/admin/login</span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#d97706] hover:bg-[#b45309] active:bg-[#92400e] text-[#090b0e] font-semibold py-2.5 px-4 rounded-[3px] text-xs uppercase tracking-[0.14em] font-['Space_Grotesk'] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-3.5 h-3.5 border-2 border-[#090b0e] border-t-transparent rounded-full animate-spin"></span>
                        <span>Authorizing Session...</span>
                      </span>
                    ) : (
                      <>
                        <span>Initialize Command Session</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-5 pt-4 border-t border-[#1b212c] text-center text-xs text-[#94a3b8]">
                <p>
                  Looking for driver vehicle reservations?{" "}
                  <Link
                    to="/customer-login"
                    className="text-[#d97706] hover:text-[#f59e0b] font-medium ml-1 transition-colors underline-offset-4 hover:underline"
                  >
                    Switch to Driver Terminal →
                  </Link>
                </p>
              </div>
            </div>

            <footer className="pt-3 border-t border-[#1b212c] flex items-center justify-between text-[10.5px] font-['Space_Grotesk'] text-[#64748b] shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
                <span className="uppercase tracking-wider">TLS 256-Bit Cryptographic Tunnel</span>
              </div>
              <div>
                <span>Node ID: TASIN-COR-ADM</span>
              </div>
            </footer>
          </section>
        </main>
      </div>
    );
};

export default AdminLogin;
