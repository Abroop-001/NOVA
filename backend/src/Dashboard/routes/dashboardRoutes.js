const express = require("express");
const router = express.Router();

const {
    getDashboardStats,
    getRecentOrders,
    getSalesOverview
} = require("../controllers/dashboardController");
const { getRegisteredCustomers } = require("../controllers/customerController");
const {
    getSalesAnalytics,
    getBestSellingProducts,
    getBrandWiseSales
} = require("../controllers/analyticsController");

const authMiddleware = require("../../Auth/middleware/authMiddleware");
const adminMiddleware = require("../../Auth/middleware/adminMiddleware");

// Dashboard statistics
router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);

// Recent 5 orders
router.get("/recent-orders", authMiddleware, adminMiddleware, getRecentOrders);

// Monthly sales overview
router.get("/sales-overview", authMiddleware, adminMiddleware, getSalesOverview);

// Advanced Sales Analytics (Daily, weekly, monthly, date-range)
router.get("/sales-analytics", authMiddleware, adminMiddleware, getSalesAnalytics);

// Admin: Registered customers listing
router.get("/customers", authMiddleware, adminMiddleware, getRegisteredCustomers);

// Admin: Best-selling products analytics
router.get("/best-sellers", authMiddleware, adminMiddleware, getBestSellingProducts);

// Admin: Brand-wise sales analytics
router.get("/brand-sales", authMiddleware, adminMiddleware, getBrandWiseSales);

module.exports = router;
