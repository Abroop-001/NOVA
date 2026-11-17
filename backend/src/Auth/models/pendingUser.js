const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
   
   username: { type: String, required: true,  trim: true  },

    email: { type: String, required: true, lowercase: true, trim: true },

    password: {   type: String,  required: true },

    otp: {type: String,  required: true },

    otpExpires: { type: Date, required: true },

    attempts: {   type: Number, default: 0 }

}, {
    timestamps: true
});

// TTL index to automatically remove expired pending signup OTP records
pendingUserSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

module.exports = PendingUser;