import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

// Module-level flag: ensures google.accounts.id.initialize() runs only once
let gsiInitialized = false;

// Module-level mutable ref for the credential callback so the latest
// closure is always invoked regardless of which component instance initialized GSI.
const callbackRef = { current: null };

const GoogleAuthButton = ({ onError, disabled }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, closeAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const hiddenBtnRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(async (response) => {
    if (isSubmittingRef.current) return;
    if (!response?.credential) {
      if (onError) onError("No credential received from Google.");
      return;
    }

    try {
      isSubmittingRef.current = true;
      setLoading(true);

      const res = await api.post("/auth/google", {
        idToken: response.credential,
      });

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
      const msg = err.response?.data?.message || "Google authentication failed. Please try again.";
      if (onError) onError(msg);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }, [loginUser, closeAuthModal, navigate, location.pathname, onError]);

  // Keep the module-level callback ref pointing to the latest closure
  useEffect(() => {
    callbackRef.current = handleCredentialResponse;
  }, [handleCredentialResponse]);

  useEffect(() => {
    if (!clientId || clientId === "your_google_client_id") return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;

      // Initialize only once globally
      if (!gsiInitialized) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              // Delegate to the latest callback ref so it's never stale
              if (callbackRef.current) callbackRef.current(response);
            },
          });
          gsiInitialized = true;
        } catch (e) {
          console.warn("GIS init error:", e);
        }
      }

      // Render the hidden button for this component instance
      if (hiddenBtnRef.current) {
        try {
          window.google.accounts.id.renderButton(hiddenBtnRef.current, {
            theme: "outline",
            size: "large",
            width: 368,
          });
        } catch (e) {
          console.warn("GIS render error:", e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGoogle();
        }
      }, 200);
      return () => clearInterval(timer);
    }
  }, [clientId]);

  const handleClick = () => {
    if (!clientId || clientId === "your_google_client_id") {
      if (onError) {
        onError("Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in .env.");
      }
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const btn = hiddenBtnRef.current?.querySelector("div[role=button]");
          if (btn) btn.click();
        }
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 my-3.5">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#9CA3AF]">OR</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      <div className="relative w-full overflow-hidden rounded-xl">
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || loading}
          className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-[#111111] hover:bg-gray-50 transition cursor-pointer disabled:opacity-60"
        >
          <GoogleIcon />
          <span>{loading ? "Signing in..." : "Continue with Google"}</span>
        </button>

        {/* Hidden GIS iframe positioned directly over the button for direct click triggers */}
        <div
          ref={hiddenBtnRef}
          className="absolute inset-0 z-10 opacity-0 pointer-events-auto cursor-pointer flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;
