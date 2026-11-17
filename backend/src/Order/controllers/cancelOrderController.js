const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../../Product/models/productModel");
const User = require("../../Auth/models/authModel");
const { sendOrderStatusUpdate } = require("../../utils/sendOrderEmail");

// POST & PUT /api/orders/cancel/:orderId
const cancelOrder = async (req, res) => {
    let session = null;
    try {
        const { orderId } = req.params;
        const query = {};

        if (orderId.startsWith("NOVA-")) {
            query.orderNumber = orderId;
        } else {
            query._id = orderId;
        }

        // Non-admin customers can only cancel their own orders
        const isStaff = req.user.role === "admin" || req.user.role === "superadmin";
        if (!isStaff) {
            query.user = req.user._id;
        }

        const order = await Order.findOne(query);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }

        if (["Shipped", "Delivered"].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled once it is ${order.status.toLowerCase()}`
            });
        }

        // Initialize MongoDB Transaction for atomic cancellation & stock restoration
        session = await mongoose.startSession();
        session.startTransaction();

        // Atomically transition status from (Processing|Confirmed) to Cancelled
        const updatedOrder = await Order.findOneAndUpdate(
            {
                _id: order._id,
                status: { $in: ["Processing", "Confirmed"] }
            },
            {
                $set: {
                    status: "Cancelled",
                    ...(order.paymentStatus === "PAID" ? { paymentStatus: "REFUNDED" } : {})
                }
            },
            { session, new: true }
        );

        if (!updatedOrder) {
            await session.abortTransaction();
            session.endSession();
            session = null;
            return res.status(400).json({
                success: false,
                message: "Order cancellation failed. Status may have already changed."
            });
        }

        // Restore stock within transaction
        for (const item of updatedOrder.items) {
            if (item.product) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }
        }

        // Commit transaction atomically
        await session.commitTransaction();
        session.endSession();
        session = null;

        // Dispatch email notification outside transaction
        try {
            const customer = await User.findById(updatedOrder.user);
            if (customer && customer.email) {
                await sendOrderStatusUpdate(customer.email, updatedOrder);
            }
        } catch (emailErr) {
            console.log("Cancellation email notification skipped:", emailErr.message);
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully and stock restored",
            order: updatedOrder
        });

    } catch (error) {
        if (session) {
            try {
                await session.abortTransaction();
                session.endSession();
            } catch (_) {}
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    cancelOrder
};
