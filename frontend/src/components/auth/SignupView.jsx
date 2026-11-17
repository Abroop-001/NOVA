import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "./GoogleAuthButton";

const SignupView = () => {
  const { setAuthModalView, setAuthData } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (username.trim().length < 3) return setError("Username must be at least 3 characters.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    try {
      setLoading(true);
      await api.post("/auth/signup", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setAuthData({ email: email.trim().toLowerCase(), username: username.trim() });
      setAuthModalView("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#111111]">Create Account</h2>
        <p className="text-sm text-[#6B7280] mt-0.5">Join the NOVA family.</p>
      </div>

      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <div className="relative">
          <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Full Name"
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
        </div>

        <div className="relative">
          <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
        </div>

        <div className="relative">
          <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-10 pl-10 pr-11 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111111] transition cursor-pointer"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        <div className="relative">
          <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full h-10 pl-10 pr-11 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111111] transition cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-1 rounded-xl bg-[#111111] text-white text-sm font-medium hover:bg-[#262626] disabled:opacity-60 transition cursor-pointer"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <GoogleAuthButton onError={(msg) => setError(msg)} disabled={loading} />

      <div className="mt-4 text-center text-xs text-[#6B7280]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setAuthModalView("login")}
          className="font-semibold text-[#111111] hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignupView;
