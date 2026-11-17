import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "./GoogleAuthButton";

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, setAuthModalView, closeAuthModal, setAuthData } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      return setError("Please fill in all fields.");
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email: email.trim(), password });
      const { token, user } = res.data;
      await loginUser(token, user);
      closeAuthModal();

      const role = user?.role;
      if (role === "admin" || role === "superadmin") {
        navigate("/admin");
      } else if (location.pathname === "/login" || location.pathname === "/signup") {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-[#111111]">Welcome Back</h2>
        <p className="text-sm text-[#6B7280] mt-1">Sign in to your account.</p>
      </div>

      {error && (
        <div className="mb-3.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
        </div>

        <div className="relative">
          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111111] transition cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-[#6B7280] pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[#E5E7EB] accent-[#111111] cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => { setAuthData({ email: email.trim() }); setAuthModalView("forgot"); }}
            className="text-xs font-medium text-[#111111] hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-1 rounded-xl bg-[#111111] text-white text-sm font-medium hover:bg-[#262626] disabled:opacity-60 transition cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <GoogleAuthButton onError={(msg) => setError(msg)} disabled={loading} />

      <div className="mt-4 text-center text-xs text-[#6B7280]">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setAuthModalView("signup")}
          className="font-semibold text-[#111111] hover:underline cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginView;
