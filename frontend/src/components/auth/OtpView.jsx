import React, { useState, useRef, useEffect } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { trackSignUp } from "../../utils/analytics";

const OtpView = () => {
  const { authData, loginUser, setAuthModalView, setAuthData } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef([]);
  const email = authData.email || "";

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const updated = [...otp];
    pasted.split("").forEach((ch, i) => { if (i < 6) updated[i] = ch; });
    setOtp(updated);
    const nextIdx = Math.min(pasted.length, 5);
    inputsRef.current[nextIdx]?.focus();
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      setError("");
      setSuccess("");
      await api.post("/auth/signup", {
        username: authData.username || email.split("@")[0],
        email,
        password: "TempPassword123!",
      });
      setSuccess("A new code was sent to your email.");
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) return setError("Please enter the complete 6-digit code.");

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-email", { email, otp: code });
      if (res.data.token) await loginUser(res.data.token, res.data.user);
      trackSignUp("email");
      setAuthData({ title: "Account Created Successfully!", message: "Welcome to NOVA. Your account is ready." });
      setAuthModalView("success");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-[#111111]">Verify Your Email</h2>
        <p className="text-xs text-[#6B7280] mt-1 max-w-xs mx-auto">
          We've sent a 6-digit code to <span className="font-semibold text-[#111111]">{email}</span>
        </p>
      </div>

      {error && <div className="mb-4 p-2.5 rounded-lg bg-red-50 text-xs text-red-600 text-center">{error}</div>}
      {success && <div className="mb-4 p-2.5 rounded-lg bg-green-50 text-xs text-green-700 text-center">{success}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-bold rounded-xl border border-[#E5E7EB] bg-white text-[#111111] outline-none focus:border-[#111111] transition"
            />
          ))}
        </div>

        <div className="text-center text-xs text-[#6B7280]">
          {countdown > 0 ? (
            <span>Resend code in <span className="font-semibold text-[#111111]">{countdown}s</span></span>
          ) : (
            <button type="button" onClick={handleResend} className="font-semibold text-[#111111] hover:underline cursor-pointer">
              Resend Code
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-[#111111] text-white text-sm font-medium hover:bg-[#262626] disabled:opacity-60 transition cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-[#6B7280]">
        Wrong email?{" "}
        <button type="button" onClick={() => setAuthModalView("signup")} className="font-semibold text-[#111111] hover:underline cursor-pointer">
          Back to Signup
        </button>
      </div>
    </div>
  );
};

export default OtpView;
