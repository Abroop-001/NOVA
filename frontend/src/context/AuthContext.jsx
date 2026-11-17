import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mergeGuestCart } from "../services/cartService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState("login");
  const [authData, setAuthData] = useState({ email: "", username: "", message: "" });

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
      try {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loginUser = async (token, userData) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsLoggedIn(true);
    window.dispatchEvent(new Event("storage"));

    try {
      await mergeGuestCart();
    } catch (err) {
      console.warn("Guest cart merge notice:", err);
    }
  };

  const logoutUser = (redirectTo = "/") => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    // Reset any stale auth modal state so old success messages don't reappear
    setAuthModalView("login");
    setAuthData({ email: "", username: "", message: "", title: "" });
    setIsAuthModalOpen(false);
    window.dispatchEvent(new Event("storage"));
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  };

  const openAuthModal = (view = "login", data = {}) => {
    setAuthModalView(view);
    if (Object.keys(data).length > 0) {
      setAuthData((prev) => ({ ...prev, ...data }));
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        authModalView,
        setAuthModalView,
        authData,
        setAuthData,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
