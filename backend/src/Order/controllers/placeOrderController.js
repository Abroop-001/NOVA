const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Cart = require("../../Cart/models/cartModel");
const Product = require("../../Product/models/productModel");
const Address = require("../../Address/models/addressModel");
const User = require("../../Auth/models/authModel");
const { sendOrderConfirmation } = require("../../utils/sendOrderEmail");

// Place Order with MongoDB Multi-Document Transactions
const placeOrder = async (req, res) => {
    let session = null;
    try {
        const { addressId } = req.body;
        const address = await Address.findOne({ _id: addressId, user: req.user._id });
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
            if (!item.product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.product.name}`
                });
            }
            const price = item.product.discountPrice != null ? item.product.discountPrice : item.product.price;
            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.product.images?.[0] || ""
            });
            totalAmount += price * item.quantity;
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
                session = null;
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.product.name}. Order cannot be placed.`
                });
            }
        }

        const [order] = await Order.create(
            [{
                orderNumber: `NOVA-${Date.now()}`,
                user: req.user._id,
                items: orderItems,
                deliveryAddress: {
                    fullName: address.fullName,
                    phone: address.phone,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    country: address.country
                },
                paymentMethod: "COD",
                totalAmount
            }],
            { session }
        );

        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();
        session = null;

        try {
            const user = await User.findById(req.user._id);
            if (user?.email) await sendOrderConfirmation(user.email, order);
        } catch (emailErr) {
            console.log("Order email notice:", emailErr.message);
        }

        res.status(201).json({ success: true, message: "Order placed successfully", order });

    } catch (error) {
        if (session) {
            try { await session.abortTransaction(); session.endSession(); } catch (_) {}
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { placeOrder };
