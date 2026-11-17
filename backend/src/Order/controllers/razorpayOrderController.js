const Cart = require("../../Cart/models/cartModel");
const Address = require("../../Address/models/addressModel");
const { getRazorpayInstance } = require("../../config/razorpay");

/**
 * Create a Razorpay Order for online checkout
 * Validates cart, stock, and shipping address; recalculates total from database prices.
 */
const createRazorpayOrder = async (req, res) => {
    try {
        const { addressId } = req.body;
        if (!addressId) {
            return res.status(400).json({ success: false, message: "Delivery address is required" });
        }

        const address = await Address.findOne({ _id: addressId, user: req.user._id });
        if (!address) {
            return res.status(404).json({ success: false, message: "Selected address not found" });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        let totalAmount = 0;
        for (const item of cart.items) {
            if (!item.product) {
                return res.status(404).json({ success: false, message: "Product in cart not found" });
            }
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.product.name}`
                });
            }
            const effectivePrice = item.product.discountPrice != null
                ? item.product.discountPrice
                : item.product.price;
            totalAmount += effectivePrice * item.quantity;
        }

        if (totalAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid order amount" });
        }

        const razorpay = getRazorpayInstance();
        if (!razorpay) {
            return res.status(500).json({
                success: false,
                message: "Razorpay is not configured on the server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
            });
        }

        const options = {
            amount: Math.round(totalAmount * 100), // amount in paise
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-8)}`,
            notes: {
                userId: req.user._id.toString(),
                addressId: address._id.toString()
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Razorpay Create Order Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create Razorpay order"
        });
    }
};

module.exports = { createRazorpayOrder };
