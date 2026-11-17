import React from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SuccessView = () => {
  const navigate = useNavigate();
  const { authData, isLoggedIn, user, setAuthModalView, closeAuthModal } = useAuth();

  const handleAction = () => {
    if (isLoggedIn) {
      closeAuthModal();
      if (user?.role === "admin" || user?.role === "superadmin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } else {
      setAuthModalView("login");
    }
  };

  return (
    <div className="relative z-10 w-full text-center py-2">
      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Check size={28} strokeWidth={2.5} />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
        {authData.title || "All Set!"}
      </h2>

      <p className="text-sm text-[#6B7280] mt-2 mb-6 max-w-xs mx-auto">
        {authData.message || "Your account action completed successfully."}
      </p>

      <button
        type="button"
        onClick={handleAction}
        className="w-full h-11 rounded-xl bg-[#111111] text-white text-sm font-medium hover:bg-[#262626] transition cursor-pointer"
      >
        {isLoggedIn ? "Continue Shopping" : "Back to Sign In"}
      </button>
    </div>
  );
};

export default SuccessView;
