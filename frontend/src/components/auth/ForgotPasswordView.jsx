import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const ForgotPasswordView = () => {
  const { authData, setAuthData, setAuthModalView } = useAuth();
  const [email, setEmail] = useState(authData.email || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      return setError("Please enter your email address.");
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setAuthData({ email: email.trim().toLowerCase() });
      setAuthModalView("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-[#111111]">Forgot Password?</h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Enter your email to receive a password reset code.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-[#111111] text-white text-sm font-medium hover:bg-[#262626] disabled:opacity-60 transition cursor-pointer"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setAuthModalView("login")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
