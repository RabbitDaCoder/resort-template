import { createContext, useContext, useState, useEffect } from "react";
import { checkAuth as checkAuthApi, logoutAdmin } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    checkAuthApi()
      .then((res) => setAdmin(res.data.data))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, adminData, refreshToken) => {
    localStorage.setItem("token", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    setAdmin(adminData);
  };

  const logout = () => {
    const rt = localStorage.getItem("refreshToken");
    if (rt) logoutAdmin(rt).catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
