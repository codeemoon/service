import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { data } = await api.get("/providers/me");
        setUser({ ...data, role: "provider" });
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/providers/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      return null;
    }
  };

  const register = async (userData) => {
    try {
      await api.post("/providers/register", userData);
      toast.success("Registration successful! Please login.");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
  };

  const silentLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, silentLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
