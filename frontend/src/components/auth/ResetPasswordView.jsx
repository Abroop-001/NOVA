import React, { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const ResetPasswordView = () => {
  const { authData, setAuthData, setAuthModalView } = useAuth();
  const email = authData.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || !newPassword || !confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (otp.trim().length !== 6) {
      return setError("OTP must be 6 digits.");
    }
    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      await api.post("/auth/verify-reset-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      await api.post("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        newPassword,
        confirmPassword,
      });

      setAuthData({
        title: "Password Reset Successful!",
        message: "Your password has been reset. You can now log in.",
      });
      setAuthModalView("success");
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-[#111111]">Reset Password</h2>
        <p className="text-xs text-[#6B7280] mt-1">
          Code sent to <span className="font-semibold text-[#111111]">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-xs text-red-600 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="6-Digit Reset Code"
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
        </div>

        <div className="relative">
          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full h-10 pl-10 pr-11 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111111] transition cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full h-10 pl-10 pr-11 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] transition"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111111] transition cursor-pointer"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 mt-1 rounded-xl bg-[#111111] text-white text-sm font-medium hover:bg-[#262626] disabled:opacity-60 transition cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <div className="mt-5 text-center">
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

export default ResetPasswordView;
