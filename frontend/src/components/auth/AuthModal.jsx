import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AuthRings from "./AuthRings";
import LoginView from "./LoginView";
import SignupView from "./SignupView";
import OtpView from "./OtpView";
import ForgotPasswordView from "./ForgotPasswordView";
import ResetPasswordView from "./ResetPasswordView";
import SuccessView from "./SuccessView";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalView } = useAuth();
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeAuthModal();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeAuthModal();
    }
  };

  const renderView = () => {
    switch (authModalView) {
      case "signup":
        return <SignupView />;
      case "otp":
        return <OtpView />;
      case "forgot":
        return <ForgotPasswordView />;
      case "reset":
        return <ResetPasswordView />;
      case "success":
        return <SuccessView />;
      case "login":
      default:
        return <LoginView />;
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-5 bg-black/50 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[440px] bg-[#FFFFFF] rounded-[18px] border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-7 sm:p-9 overflow-hidden transition-all animate-in zoom-in-95 duration-200"
      >
        <AuthRings />

        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#111111] hover:bg-gray-100 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 text-center mb-5">
          <span className="text-2xl font-bold tracking-[8px] text-[#111111] select-none">
            NOVA
          </span>
        </div>

        {renderView()}
      </div>
    </div>
  );
};

export default AuthModal;
