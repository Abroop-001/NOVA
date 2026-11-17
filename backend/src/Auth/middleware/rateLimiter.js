/**
 * Reusable In-Memory Rate Limiting Middleware
 * Tracks request counts per client IP and email without external dependencies.
 */
const createRateLimiter = ({
    windowMs = 15 * 60 * 1000,
    max = 5,
    message = "Too many requests. Please try again later."
}) => {
    const records = new Map();

    // Auto-cleanup expired tracking buckets periodically
    const cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of records.entries()) {
            if (now > record.resetTime) {
                records.delete(key);
            }
        }
    }, 5 * 60 * 1000);
    cleanupInterval.unref();

    return (req, res, next) => {
        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket?.remoteAddress ||
            "unknown-client";
        const email = req.body?.email ? `:${req.body.email.toLowerCase().trim()}` : "";
        const key = `${ip}${email}`;
        const now = Date.now();

        let record = records.get(key);

        if (!record || now > record.resetTime) {
            record = { count: 1, resetTime: now + windowMs };
            records.set(key, record);
            return next();
        }

        if (record.count >= max) {
            const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
            res.setHeader("Retry-After", retryAfterSec);
            return res.status(429).json({
                success: false,
                message,
                retryAfter: retryAfterSec
            });
        }

        record.count += 1;
        next();
    };
};

// 1. Login rate limit (5 attempts per 15 mins)
const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts. Please try again in 15 minutes."
});

// 2. Signup OTP verification limit (5 attempts per 10 mins)
const signupOtpLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Too many verification attempts. Please wait 10 minutes or request a new OTP."
});

// 3. Forgot password request limit (3 requests per 15 mins)
const forgotPasswordLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Too many password reset requests. Please wait 15 minutes before trying again."
});

// 4. Password reset OTP verification limit (5 attempts per 10 mins)
const resetOtpLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Too many OTP verification attempts. Please wait 10 minutes."
});

module.exports = {
    createRateLimiter,
    loginLimiter,
    signupOtpLimiter,
    forgotPasswordLimiter,
    resetOtpLimiter
};
