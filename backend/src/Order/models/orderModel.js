const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true, min: 0 },
            quantity: { type: Number, required: true, min: 1 },
            size: { type: Number, required: true },
            color: { type: String },
            image: { type: String }
        }
    ],
    deliveryAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online", "RAZORPAY"],
        default: "COD"
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
        default: "PENDING"
    },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    paymentDetails: { type: mongoose.Schema.Types.Mixed, default: null },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
        default: "Processing"
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
