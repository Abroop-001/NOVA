const mongoose = require("mongoose");
const Cart = require("../models/cartModel");
const Product = require("../../Product/models/productModel");
const { findMatchingCartItem, validateProductVariant } = require("./cartHelper");

// POST /api/cart/add
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, size, color = "" } = req.body;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Valid product ID is required" });
        }

        if (size == null || isNaN(Number(size))) {
            return res.status(400).json({ success: false, message: "Valid shoe size is required" });
        }

        const qty = Number(quantity);
        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.stock < 1) {
            return res.status(400).json({ success: false, message: `${product.name} is currently out of stock` });
        }

        const variantCheck = validateProductVariant(product, size, color);
        if (!variantCheck.valid) {
            return res.status(400).json({ success: false, message: variantCheck.message });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItem = findMatchingCartItem(cart.items, productId, size, color);

        if (existingItem) {
            const newQty = existingItem.quantity + qty;
            if (newQty > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} units available in stock. You already have ${existingItem.quantity} in your bag.`
                });
            }
            existingItem.quantity = newQty;
        } else {
            if (qty > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} units available in stock.`
                });
            }
            cart.items.push({
                product: productId,
                quantity: qty,
                size: Number(size),
                color: color || ""
            });
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: existingItem ? "Cart quantity updated" : "Product added to cart",
            cart
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addToCart
};
