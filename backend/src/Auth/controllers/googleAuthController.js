const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/authModel");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Handle Google Authentication with ID token verification
 */
const googleAuth = async (req, res) => {
    try {
        const idToken = req.body.idToken || req.body.token || req.body.credential;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: "Google ID token is required"
            });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "your_google_client_id") {
            return res.status(500).json({
                success: false,
                message: "Server Google Client ID is not configured. Please set GOOGLE_CLIENT_ID."
            });
        }

        // Verify ID token audience and signature with Google
        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: clientId
            });
            payload = ticket.getPayload();
        } catch (verifyErr) {
            console.error("Google Token Verification Error:", verifyErr.message);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired Google token. Please try again."
            });
        }

        const googleId = payload.sub;
        const email = payload.email?.trim().toLowerCase();
        const emailVerified = payload.email_verified;
        const name = payload.name || payload.given_name || email.split("@")[0];

        if (!email || !emailVerified) {
            return res.status(400).json({
                success: false,
                message: "Google email is not verified by Google"
            });
        }

        // 1. Find user by googleId or verified email
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.findOne({ email });
        }

        if (user) {
            // Safely link Google ID to existing account if not yet linked
            // (never overwrite existing password or elevate role)
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.isEmailVerified) user.isEmailVerified = true;
                await user.save();
            }
        } else {
            // 2. Create new customer account (never assign admin or superadmin automatically)
            // Ensures username is unique or formatted cleanly
            let baseUsername = name.trim().slice(0, 30) || email.split("@")[0];
            const existingUsername = await User.findOne({ username: baseUsername });
            if (existingUsername) {
                baseUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
            }

            user = await User.create({
                username: baseUsername,
                email,
                googleId,
                isEmailVerified: true,
                role: "customer"
            });
        }

        const role = user.role || "customer";

        // Generate standard NOVA JWT token
        const token = jwt.sign(
            { id: user._id, role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Google authentication successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role
            }
        });

    } catch (error) {
        console.error("Google Auth Controller Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Google authentication failed. Please try again."
        });
    }
};

module.exports = { googleAuth };
