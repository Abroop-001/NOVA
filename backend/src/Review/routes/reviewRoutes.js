const express = require("express");
const router = express.Router();

const {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
} = require("../controllers/reviewController");
const { getAllReviewsAdmin } = require("../controllers/adminReviewController");

const authMiddleware = require("../../Auth/middleware/authMiddleware");
const adminMiddleware = require("../../Auth/middleware/adminMiddleware");

// Admin: Get all reviews across all products (must be defined before /:reviewId)
router.get("/admin/all", authMiddleware, adminMiddleware, getAllReviewsAdmin);

// Add review (logged-in users)
router.post("/", authMiddleware, addReview);

// Get product reviews (public)
router.get("/product/:productId", getProductReviews);

// Update own review (logged-in users)
router.put("/:reviewId", authMiddleware, updateReview);

// Delete review (logged-in users / admins)
router.delete("/:reviewId", authMiddleware, deleteReview);

module.exports = router;

