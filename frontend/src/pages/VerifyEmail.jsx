import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthRings from "../components/auth/AuthRings";
import OtpView from "../components/auth/OtpView";
import LoginView from "../components/auth/LoginView";
import SuccessView from "../components/auth/SuccessView";

const VerifyEmail = () => {
  const location = useLocation();
  const { authModalView, setAuthModalView, setAuthData } = useAuth();

  useEffect(() => {
    setAuthModalView("otp");
    if (location.state?.email) {
      setAuthData({ email: location.state.email });
    }
  }, [location.state, setAuthModalView, setAuthData]);

  const renderContent = () => {
    switch (authModalView) {
      case "login":
        return <LoginView />;
      case "success":
        return <SuccessView />;
      case "otp":
      default:
        return <OtpView />;
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-5 bg-gray-50">
      <div className="relative w-full max-w-[440px] bg-[#FFFFFF] rounded-[18px] border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-7 sm:p-9 overflow-hidden">
        <AuthRings />

        <Link
          to="/"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#111111] hover:bg-gray-100 transition"
          aria-label="Back to home"
        >
          <X size={18} />
        </Link>

        <div className="relative z-10 text-center mb-5">
          <span className="text-2xl font-bold tracking-[8px] text-[#111111] select-none">
            NOVA
          </span>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmail;
