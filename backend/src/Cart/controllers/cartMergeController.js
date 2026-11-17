const mongoose = require("mongoose");
const Cart = require("../models/cartModel");
const Product = require("../../Product/models/productModel");
const { findMatchingCartItem, validateProductVariant } = require("./cartHelper");

// POST /api/cart/merge
const mergeCart = async (req, res) => {
    try {
        const rawItems = req.body.items || req.body.guestItems || [];

        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            let existingCart = await Cart.findOne({ user: req.user._id }).populate("items.product");
            if (!existingCart) existingCart = { items: [] };

            return res.status(200).json({
                success: true,
                message: "No guest items to merge",
                cart: existingCart,
                summary: { totalReceived: 0, mergedCount: 0, skippedCount: 0, skippedItems: [] }
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const skippedItems = [];
        let mergedCount = 0;

        for (const item of rawItems) {
            const rawProductId = item.productId || item.product?._id || item.product?.id || item.product;

            if (!rawProductId || !mongoose.Types.ObjectId.isValid(rawProductId)) {
                skippedItems.push({ item, reason: "Invalid product identifier" });
                continue;
            }

            const size = item.size;
            if (size == null || isNaN(Number(size))) {
                skippedItems.push({ item, reason: "Missing or invalid shoe size" });
                continue;
            }

            const itemQty = Math.max(1, parseInt(item.quantity, 10) || 1);
            const color = item.color || "";

            const product = await Product.findById(rawProductId);
            if (!product) {
                skippedItems.push({ item, reason: "Product does not exist" });
                continue;
            }

            if (product.stock < 1) {
                skippedItems.push({ item, reason: `${product.name} is out of stock` });
                continue;
            }

            const variantCheck = validateProductVariant(product, size, color);
            if (!variantCheck.valid) {
                skippedItems.push({ item, reason: variantCheck.message });
                continue;
            }

            const existingItem = findMatchingCartItem(cart.items, rawProductId, size, color);

            if (existingItem) {
                // Prevent duplicate additions on duplicate/repeated network syncs:
                // If item already exists with quantity >= available stock, skip
                if (existingItem.quantity >= product.stock) {
                    skippedItems.push({
                        item,
                        reason: `Maximum available stock (${product.stock}) already in cart`
                    });
                    continue;
                }

                // If already at or above guest quantity on retry, retain the highest quantity
                if (existingItem.quantity >= itemQty) {
                    // Safe against repeated calls: keep existing verified quantity
                    mergedCount += 1;
                } else {
                    existingItem.quantity = Math.min(product.stock, existingItem.quantity + itemQty);
                    mergedCount += 1;
                }
            } else {
                const addQty = Math.min(product.stock, itemQty);
                cart.items.push({
                    product: product._id,
                    quantity: addQty,
                    size: Number(size),
                    color: color || ""
                });
                mergedCount += 1;
            }
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Guest cart merged successfully",
            cart,
            summary: {
                totalReceived: rawItems.length,
                mergedCount,
                skippedCount: skippedItems.length,
                skippedItems
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    mergeCart
};
