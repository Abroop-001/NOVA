import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import { trackSignUp } from "../../utils/analytics";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

// Module-level state: ensures google.accounts.id.initialize() is called only once
let gsiInitialized = false;
let gsiClientId = null;

// Module-level ref to always delegate to the latest authentication callback
const callbackRef = { current: null };

const GoogleAuthButton = ({ onError, disabled }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, closeAuthModal, authModalView } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const btnContainerRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(
    async (response) => {
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

        if (location.pathname === "/signup" || authModalView === "signup") {
          trackSignUp("google");
        }

        closeAuthModal();

        const role = user?.role;
        if (role === "admin" || role === "superadmin") {
          navigate("/admin");
        } else if (location.pathname === "/login" || location.pathname === "/signup") {
          navigate("/home");
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Google authentication failed. Please try again.";
        if (onError) onError(msg);
      } finally {
        setLoading(false);
        isSubmittingRef.current = false;
      }
    },
    [loginUser, closeAuthModal, navigate, location.pathname, onError]
  );

  // Always keep callbackRef pointing to the freshest closure
  useEffect(() => {
    callbackRef.current = handleCredentialResponse;
  }, [handleCredentialResponse]);

  // Initialize GIS once and render the button into this component instance
  useEffect(() => {
    if (!clientId || clientId === "your_google_client_id") return;

    let isMounted = true;

    const renderGoogleButton = () => {
      if (!isMounted || !btnContainerRef.current || !window.google?.accounts?.id) return;

      // 1. Initialize only once globally (or if client_id changed)
      if (!gsiInitialized || gsiClientId !== clientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (callbackRef.current) {
                callbackRef.current(response);
              }
            },
          });
          gsiInitialized = true;
          gsiClientId = clientId;
        } catch (e) {
          console.warn("Google Sign-In initialization error:", e);
        }
      }

      // 2. Measure container width (Google supports 200px - 400px)
      const containerWidth = btnContainerRef.current.clientWidth || 368;
      const targetWidth = Math.min(400, Math.max(200, Math.floor(containerWidth)));

      // 3. Clear container to avoid duplicate iframes on re-renders
      btnContainerRef.current.innerHTML = "";

      // 4. Render native Google button (handles clicks and popups directly)
      try {
        window.google.accounts.id.renderButton(btnContainerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
          width: targetWidth,
        });
        if (isMounted) setIsRendered(true);
      } catch (e) {
        console.warn("Google button render error:", e);
      }
    };

    // Check script readiness
    if (window.google?.accounts?.id) {
      // Use requestAnimationFrame to ensure DOM dimensions are ready (e.g. inside animated modal)
      requestAnimationFrame(() => {
        renderGoogleButton();
      });
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          renderGoogleButton();
        }
      }, 150);
      return () => {
        isMounted = false;
        clearInterval(timer);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  if (!clientId || clientId === "your_google_client_id") {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 my-3.5">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#9CA3AF]">
          OR
        </span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      <div className="w-full flex justify-center items-center min-h-[44px]">
        {loading ? (
          <div className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-[#111111]">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span>Signing in with Google...</span>
          </div>
        ) : (
          <>
            {/* Native Google Sign-In Button Container */}
            <div
              ref={btnContainerRef}
              className={`w-full flex justify-center ${disabled ? "pointer-events-none opacity-50" : ""}`}
              style={{ display: isRendered ? "flex" : "none" }}
            />

            {/* Placeholder while Google Identity Services script loads */}
            {!isRendered && (
              <div className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-medium text-[#111111] animate-pulse">
                <GoogleIcon />
                <span>Continue with Google</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthButton;
