const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({


email: { type: String, required: true, lowercase: true, trim: true },

otp: { type: String, required: true },

expiresAt: { type: Date, required: true },

isVerified: { type: Boolean, default: false }


}, {
timestamps: true
});

// TTL index to automatically remove expired password reset OTP records
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

module.exports = PasswordReset;

