const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const dns = require("node:dns").promises;
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Auth/models/authModel");

const bootstrapSuperAdmin = async () => {
    const email = (process.env.SUPER_ADMIN_EMAIL || process.env.EMAIL_USER || "").trim().toLowerCase();
    const rawPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!email) {
        console.error("Error: SUPER_ADMIN_EMAIL or EMAIL_USER is not configured in .env");
        process.exit(1);
    }

    if (!rawPassword || rawPassword.length < 8) {
        console.error("Error: SUPER_ADMIN_PASSWORD must be at least 8 characters in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB database.");

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        let user = await User.findOne({ email });

        if (user) {
            user.role = "superadmin";
            user.password = hashedPassword;
            user.isEmailVerified = true;
            if (!user.username) user.username = "SuperAdmin";
            await user.save();
            console.log(`Success: Existing account [${email}] elevated to Super Admin.`);
        } else {
            user = await User.create({
                username: "SuperAdmin",
                email,
                password: hashedPassword,
                role: "superadmin",
                isEmailVerified: true
            });
            console.log(`Success: Super Admin account created for [${email}].`);
        }

        await mongoose.disconnect();
        console.log("Super Admin bootstrap completed successfully.");
        process.exit(0);

    } catch (error) {
        console.error("Super Admin bootstrap error:", error.message);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
};

bootstrapSuperAdmin();
