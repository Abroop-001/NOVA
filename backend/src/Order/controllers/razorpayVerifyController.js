const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Cart = require("../../Cart/models/cartModel");
const Product = require("../../Product/models/productModel");
const Address = require("../../Address/models/addressModel");
const User = require("../../Auth/models/authModel");
const { getRazorpayInstance } = require("../../config/razorpay");
const { sendOrderConfirmation } = require("../../utils/sendOrderEmail");

const verifyRazorpayPayment = async (req, res) => {
    let session = null;
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, addressId } = req.body;
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !addressId) {
            return res.status(400).json({ success: false, message: "Missing payment parameters" });
        }
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: "Server Razorpay secret is not configured" });
        }

        const expected = crypto.createHmac("sha256", secret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
        if (expected !== razorpaySignature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature verification failed" });
        }

        // Prevent duplicate orders from same payment/order ID
        const existingOrder = await Order.findOne({ $or: [{ razorpayPaymentId }, { razorpayOrderId }] });
        if (existingOrder) {
            return res.status(200).json({ success: true, message: "Payment already verified", order: existingOrder });
        }

        const address = await Address.findOne({ _id: addressId, user: req.user._id });
        if (!address) return res.status(404).json({ success: false, message: "Delivery address not found" });

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || !cart.items?.length) return res.status(400).json({ success: false, message: "Cart is empty" });

        let totalAmount = 0;
        const orderItems = [];
        for (const item of cart.items) {
            if (!item.product) return res.status(404).json({ success: false, message: "Product in cart not found" });
            if (item.product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${item.product.name}` });
            }
            const price = item.product.discountPrice != null ? item.product.discountPrice : item.product.price;
            orderItems.push({
                product: item.product._id, name: item.product.name, price,
                quantity: item.quantity, size: item.size, color: item.color,
                image: item.product.images?.[0] || ""
            });
            totalAmount += price * item.quantity;
        }

        // Razorpay API verification of order ownership, currency, amount & payment status
        const razorpay = getRazorpayInstance();
        if (razorpay) {
            try {
                const rzOrder = await razorpay.orders.fetch(razorpayOrderId);
                if (rzOrder.notes?.userId && rzOrder.notes.userId !== req.user._id.toString()) {
                    return res.status(403).json({ success: false, message: "Payment order does not belong to authenticated user" });
                }
                const expectedPaise = Math.round(totalAmount * 100);
                if (rzOrder.amount !== expectedPaise || rzOrder.currency !== "INR") {
                    return res.status(400).json({ success: false, message: "Payment amount or currency mismatch" });
                }
                const rzPayment = await razorpay.payments.fetch(razorpayPaymentId);
                if (rzPayment.order_id !== razorpayOrderId) {
                    return res.status(400).json({ success: false, message: "Payment ID does not match Razorpay order" });
                }
                if (!["captured", "authorized"].includes(rzPayment.status)) {
                    return res.status(400).json({ success: false, message: `Payment not completed (status: ${rzPayment.status})` });
                }
            } catch (apiErr) {
                console.warn("Razorpay API verification check notice:", apiErr.message);
            }
        }

        session = await mongoose.startSession();
        session.startTransaction();

        for (const item of cart.items) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { session, new: true }
            );
            if (!updated) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ success: false, message: `Insufficient stock for ${item.product.name}` });
            }
        }

        const addr = {
            fullName: address.fullName, phone: address.phone, addressLine1: address.addressLine1,
            addressLine2: address.addressLine2, city: address.city, state: address.state,
            pincode: address.pincode, country: address.country
        };

        const [order] = await Order.create([{
            orderNumber: `NOVA-${Date.now()}`, user: req.user._id, items: orderItems,
            deliveryAddress: addr, paymentMethod: "RAZORPAY", paymentStatus: "PAID",
            razorpayOrderId, razorpayPaymentId, razorpaySignature, totalAmount, status: "Processing"
        }], { session });

        cart.items = [];
        await cart.save({ session });
        await session.commitTransaction();
        session.endSession();
        session = null;

        try {
            const user = await User.findById(req.user._id);
            if (user?.email) await sendOrderConfirmation(user.email, order);
        } catch (e) { console.log("Order email notice:", e.message); }

        return res.status(201).json({ success: true, message: "Payment verified successfully", order });
    } catch (error) {
        if (session) { try { await session.abortTransaction(); session.endSession(); } catch (_) {} }
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { verifyRazorpayPayment };
