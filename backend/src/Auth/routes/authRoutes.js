const express = require("express");
const router = express.Router();

const { signup, verifyEmail } = require("../controllers/authSignup");
const { login } = require("../controllers/authLogin");
const { googleAuth } = require("../controllers/googleAuthController");
const { forgotPassword, verifyResetOTP, resetPassword } = require("../controllers/forgotPasswordController");
const { getProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const {
    loginLimiter,
    signupOtpLimiter,
    forgotPasswordLimiter,
    resetOtpLimiter
} = require("../middleware/rateLimiter");

// Signup
router.post("/signup", signup);

// Email verification (Rate limited)
router.post("/verify-email", signupOtpLimiter, verifyEmail);

// Login (Rate limited)
router.post("/login", loginLimiter, login);

// Google Authentication
router.post("/google", googleAuth);

// Customer Profile
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Forgot password (Rate limited)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

// Verify reset OTP (Rate limited)
router.post("/verify-reset-otp", resetOtpLimiter, verifyResetOTP);

// Reset password
router.post("/reset-password", resetPassword);

module.exports = router;