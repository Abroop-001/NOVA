const Cart = require("../models/cartModel");
const Product = require("../../Product/models/productModel");

// GET /api/cart
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart) {
            cart = { items: [] };
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/cart/update/:itemId
const updateCart = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { itemId } = req.params;

        const qty = Number(quantity);
        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product no longer exists" });
        }

        if (qty > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} units available in stock`
            });
        }

        item.quantity = qty;
        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({ success: true, message: "Cart updated successfully", cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/cart/remove/:itemId
const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex((item) => item._id.toString() === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({ success: true, message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCart,
    updateCart,
    removeFromCart
};
