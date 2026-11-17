const dns = require("node:dns").promises;
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./Auth/routes/authRoutes");
const productRoutes = require("./Product/routes/productRoutes");
const cartRoutes = require("./Cart/routes/cartRoutes");
const wishlistRoutes = require("./Wishlist/routes/wishlistRoutes");
const addressRoutes = require("./Address/routes/addressRoutes");
const orderRoutes = require("./Order/routes/orderRoutes");
const reviewRoutes = require("./Review/routes/reviewRoutes");
const dashboardRoutes = require("./Dashboard/routes/dashboardRoutes");

const notFoundHandler = require("./middleware/notFoundHandler");
const errorHandler = require("./middleware/errorHandler");

const app = express();

connectDB();

// Dynamic CORS origins: local dev defaults + environment-configured production URLs
const parseAllowedOrigins = () => {
    const defaults = ["http://localhost:5173", "http://localhost:3000"];
    const envOrigins = (process.env.FRONTEND_URL || process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    return Array.from(new Set([...defaults, ...envOrigins]));
};

const allowedOrigins = parseAllowedOrigins();

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
            return callback(null, true);
        }

        return callback(new Error(`CORS Error: Origin ${origin} not authorized`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Centralized 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

module.exports = app;
