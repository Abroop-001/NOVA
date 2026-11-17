const User = require("../models/authModel");
const PendingUser = require("../models/pendingUser");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendOTP = require("../../utils/sendEmail");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check empty fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check username length
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3 to 30 characters",
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    await PendingUser.deleteMany({ email });

    
    // Save pending user
    await PendingUser.create({
      username,
      email,
      password: hashedPassword,
      otp: hashedOTP,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send OTP email
    await sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("Signup Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during signup",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
    return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
    });
}

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please signup again.",
      });
    }

    // Check OTP expiry
    if (pendingUser.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please signup again.",
      });
    }

    // Check OTP
    const isValidOTP = await bcrypt.compare(otp, pendingUser.otp);
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

      // Create actual user
        const user = await User.create({
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.password,
            isEmailVerified: true
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Delete pending user
        await PendingUser.deleteOne({ email });

        return res.status(201).json({
            success: true,
            message: "Email verified successfully. You are logged in!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};
  

module.exports = { signup ,verifyEmail };
