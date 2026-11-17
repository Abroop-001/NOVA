const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getMyOrders,
    getOrderDetails,
    getAllOrders,
    updateOrderStatus,
    createRazorpayOrder,
    verifyRazorpayPayment,
    razorpayWebhook
} = require("../controllers/orderController");
const { cancelOrder } = require("../controllers/cancelOrderController");

const authMiddleware = require("../../Auth/middleware/authMiddleware");
const adminMiddleware = require("../../Auth/middleware/adminMiddleware");

// Place order (COD)
router.post("/place", authMiddleware, placeOrder);

// Razorpay payment integration routes
router.post("/razorpay/create-order", authMiddleware, createRazorpayOrder);
router.post("/razorpay/verify-payment", authMiddleware, verifyRazorpayPayment);
router.post("/razorpay/webhook", razorpayWebhook);

// Customer / Admin: Cancel order (supports both POST and PUT)
router.post("/cancel/:orderId", authMiddleware, cancelOrder);
router.put("/cancel/:orderId", authMiddleware, cancelOrder);

// Get customer order history
router.get("/my-orders", authMiddleware, getMyOrders);

// Admin: Get all orders
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);

// Admin: Update order status
router.put("/admin/status/:orderId", authMiddleware, adminMiddleware, updateOrderStatus);

// Get individual order details
router.get("/:orderId", authMiddleware, getOrderDetails);

module.exports = router;