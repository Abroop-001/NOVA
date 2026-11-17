const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../../Product/models/productModel");
const User = require("../../Auth/models/authModel");
const { sendOrderStatusUpdate } = require("../../utils/sendOrderEmail");

// Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
    let session = null;
    try {
        const { status } = req.body;
        const allowedStatuses = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.orderId);

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

        if (status === "Cancelled" && ["Shipped", "Delivered"].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: "This order cannot be cancelled once shipped or delivered"
            });
        }

        // If cancelling, use transaction for atomic stock restoration & status update
        if (status === "Cancelled") {
            session = await mongoose.startSession();
            session.startTransaction();

            for (const item of order.items) {
                if (item.product) {
                    await Product.findByIdAndUpdate(
                        item.product,
                        { $inc: { stock: item.quantity } },
                        { session }
                    );
                }
            }

            order.status = "Cancelled";
            if (order.paymentStatus === "PAID") {
                order.paymentStatus = "REFUNDED";
            }
            await order.save({ session });

            await session.commitTransaction();
            session.endSession();
            session = null;
        } else {
            order.status = status;
            if (status === "Delivered" && order.paymentMethod === "COD") {
                order.paymentStatus = "PAID";
            }
            await order.save();
        }

        // Send notification email outside transaction
        try {
            const customer = await User.findById(order.user);
            if (customer && customer.email) {
                await sendOrderStatusUpdate(customer.email, order);
            }
        } catch (emailError) {
            console.log("Order status update email failed:", emailError.message);
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
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
    updateOrderStatus
};
