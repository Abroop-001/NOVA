const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    mergeCart
} = require("../controllers/cartController");

const authMiddleware = require("../../Auth/middleware/authMiddleware");

// Merge guest cart items into authenticated user's cart
router.post("/merge", authMiddleware, mergeCart);

// Add product to cart
router.post("/add", authMiddleware, addToCart);

// Get logged-in user's cart
router.get("/", authMiddleware, getCart);

// Update cart item quantity
router.put("/update/:itemId", authMiddleware, updateCart);

// Remove product from cart
router.delete("/remove/:itemId", authMiddleware, removeFromCart);

module.exports = router;