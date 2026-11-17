const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const Product = require("../../Product/models/productModel");
const Order = require("../../Order/models/orderModel");

// POST /api/reviews
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID is required"
            });
        }

        const numRating = Number(rating);
        if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        if (!comment || typeof comment !== "string" || comment.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Review comment must be at least 3 characters long"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Verified-Purchase validation: customer must have a DELIVERED order for this product
        const verifiedPurchase = await Order.findOne({
            user: req.user._id,
            status: "Delivered",
            "items.product": productId
        });

        if (!verifiedPurchase) {
            return res.status(403).json({
                success: false,
                message: "Only verified buyers who have received this product (Delivered) can submit a review"
            });
        }

        // Prevent duplicate reviews by the same customer for the same product
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating: numRating,
            comment: comment.trim()
        });

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addReview
};
