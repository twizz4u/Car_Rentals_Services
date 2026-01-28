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
    // Check for existing token and user on mount
    const storedToken = sessionStorage.getItem("adminToken");
    const storedUser = sessionStorage.getItem("adminUser");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
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

