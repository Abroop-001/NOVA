const express = require("express");
const router = express.Router();

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} = require("../controllers/wishlistController");

const authMiddleware = require("../../Auth/middleware/authMiddleware");

// Add product to wishlist
router.post("/add", authMiddleware, addToWishlist);

// Get logged-in user's wishlist
router.get("/", authMiddleware, getWishlist);

// Remove product from wishlist
router.delete("/remove/:productId", authMiddleware, removeFromWishlist);

module.exports = router;
