import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Initialize from sessionStorage on first load
    return sessionStorage.getItem("adminToken") || null;
  });
  const [user, setUser] = useState(() => {
    // Initialize user from sessionStorage
    const storedUser = sessionStorage.getItem("adminUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Re-read the authoritative session state from sessionStorage.
    const syncFromStorage = () => {
      const storedToken = sessionStorage.getItem("adminToken");
      const storedUser = sessionStorage.getItem("adminUser");
      setToken(storedToken || null);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Check for existing token and user on mount
    syncFromStorage();
    setIsLoading(false);

    // Mobile browsers restore pages from the back/forward cache (bfcache),
    // reviving the whole JS heap — including this React state — and skipping
    // the mount-time read. After a logout that leaves the session cleared in
    // sessionStorage, back-navigation could therefore still look
    // authenticated. `pageshow` fires on every restore (and on normal loads),
    // so we re-sync against the real session so a destroyed session can never
    // be resurrected.
    const onPageShow = (event) => {
      if (event.persisted) syncFromStorage();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const login = (newToken, userData) => {
    sessionStorage.setItem("adminToken", newToken);
    setToken(newToken);
    if (userData) {
      sessionStorage.setItem("adminUser", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  const value = {
    token,
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

