const User = require("../models/authModel");

// GET /api/auth/profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone || "",
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const { username, phone } = req.body;
        const updates = {};

        if (username !== undefined) {
            const trimmedUsername = String(username).trim();
            if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
                return res.status(400).json({
                    success: false,
                    message: "Username must be between 3 and 30 characters"
                });
            }
            updates.username = trimmedUsername;
        }

        if (phone !== undefined) {
            const trimmedPhone = String(phone).trim();
            if (trimmedPhone && !/^[0-9+\-\s()]{7,20}$/.test(trimmedPhone)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid phone number"
                });
            }
            updates.phone = trimmedPhone;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid profile fields provided for update"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                phone: updatedUser.phone || "",
                role: updatedUser.role,
                isEmailVerified: updatedUser.isEmailVerified,
                createdAt: updatedUser.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
