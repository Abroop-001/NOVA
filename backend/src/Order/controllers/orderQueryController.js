const Order = require("../models/orderModel");

// Get customer's order history
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single order details
// Both Admin and Super Admin can view any order; normal customers can only view their own
const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const query = {};

        if (orderId.startsWith("NOVA-")) {
            query.orderNumber = orderId;
        } else {
            query._id = orderId;
        }

        const isStaff = req.user.role === "admin" || req.user.role === "superadmin";
        if (!isStaff) {
            query.user = req.user._id;
        }

        const order = await Order.findOne(query).populate("user", "username email role");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all orders across all customers
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "username email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMyOrders,
    getOrderDetails,
    getAllOrders
};
