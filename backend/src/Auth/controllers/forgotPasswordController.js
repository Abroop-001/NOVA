const User = require("../models/authModel");
const PasswordReset = require("../models/passwordResetModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendOTP = require("../../utils/sendEmail");

// Forgot password - send OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (user) {
            // Delete previous reset records
            await PasswordReset.deleteMany({ email: normalizedEmail });

            // Generate 6-digit OTP
            const otp = crypto.randomInt(100000, 1000000).toString();

            // Hash OTP
            const hashedOTP = await bcrypt.hash(otp, 10);

            // Save reset record
            await PasswordReset.create({
                email: normalizedEmail,
                otp: hashedOTP,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            });

            // Send OTP email
            await sendOTP(normalizedEmail, otp);
        }

        return res.status(200).json({
            success: true,
            message: "If an account with that email exists, an OTP has been sent"
        });

    } catch (error) {
        console.log("Forgot Password Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


// Verify reset OTP
const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const resetRecord = await PasswordReset.findOne({
            email: normalizedEmail
        });

        if (!resetRecord) {
            return res.status(400).json({
                success: false,
                message: "No password reset request found"
            });
        }

        // Check expiry
        if (resetRecord.expiresAt < new Date()) {
            await PasswordReset.deleteOne({ _id: resetRecord._id });

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one"
            });
        }

        // Prevent OTP reuse
        if (resetRecord.isVerified) {
            return res.status(400).json({
                success: false,
                message: "OTP has already been verified"
            });
        }

        // Compare OTP
        const isValidOTP = await bcrypt.compare(otp, resetRecord.otp);

        if (!isValidOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Mark as verified
        resetRecord.isVerified = true;
        await resetRecord.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password"
        });

    } catch (error) {
        console.log("Verify Reset OTP Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const resetRecord = await PasswordReset.findOne({
            email: normalizedEmail
        });

        if (!resetRecord) {
            return res.status(400).json({
                success: false,
                message: "No password reset request found"
            });
        }

        // Check OTP was verified
        if (!resetRecord.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your OTP first"
            });
        }

        // Check expiry
        if (resetRecord.expiresAt < new Date()) {
            await PasswordReset.deleteOne({ _id: resetRecord._id });

            return res.status(400).json({
                success: false,
                message: "Reset session has expired. Please request a new OTP"
            });
        }

        // Check user exists
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        // Delete reset record
        await PasswordReset.deleteOne({ _id: resetRecord._id });

        return res.status(200).json({
            success: true,
            message: "Password reset successful. You can now login with your new password"
        });

    } catch (error) {
        console.log("Reset Password Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


module.exports = {
    forgotPassword,
    verifyResetOTP,
    resetPassword
};