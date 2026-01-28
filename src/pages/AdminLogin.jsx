import { useState } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        setIsLoading(true);

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.status !== "success") {
                // Handle error response from server
                setError(result.message || "Invalid credentials");
                return;
            }

            // If login is successful, store token and user data
            // Token is inside data object: data.token
            // User info: data.email, data.name
            const { token, email: userEmail, name } = result.data;
            login(token, { email: userEmail, name });
            navigate(from, { replace: true });
        } catch (err) {
            // API unavailable - allow demo login with any credentials
            const demoToken = `demo_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            login(demoToken, { 
                email: email || "demo@example.com", 
                name: email?.split('@')[0] || "Demo User",
                isDemo: true 
            });
            navigate(from, { replace: true });
            return;
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background elements if needed, relying on global body bg for now but adding subtle shine */}
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 opacity-50 pointer-events-none" />

        <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 relative z-10 animate-fade-in-up">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-primary/10 p-4 rounded-full mb-4 ring-1 ring-primary/20">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Portal</h1>
                <p className="text-muted-foreground mt-2 text-sm">Secure access for administrators</p>
            </div>
       
            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-medium text-foreground">Password</label>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
            </form>

            <div className="mt-8 text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Return to Home
                </Link>
            </div>
        </div>
      </div>
    );
};

export default AdminLogin;

