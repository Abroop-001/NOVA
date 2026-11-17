const Review = require("../models/reviewModel");

// GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId
        }).populate("user", "username").sort({ createdAt: -1 });

        let averageRating = 0;

        if (reviews.length > 0) {
            const total = reviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = parseFloat((total / reviews.length).toFixed(1));
        }

        res.status(200).json({
            success: true,
            totalReviews: reviews.length,
            averageRating,
            reviews
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// PUT /api/reviews/:reviewId
const updateReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.reviewId,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        const { rating, comment } = req.body;

        if (rating !== undefined) {
            const num = Number(rating);
            if (!Number.isInteger(num) || num < 1 || num > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Rating must be an integer between 1 and 5"
                });
            }
            review.rating = num;
        }

        if (comment !== undefined) {
            const trimmed = String(comment).trim();
            if (trimmed.length < 3) {
                return res.status(400).json({
                    success: false,
                    message: "Review comment must be at least 3 characters"
                });
            }
            review.comment = trimmed;
        }

        await review.save();

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE /api/reviews/:reviewId
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        const isOwner = review.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own reviews"
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProductReviews,
    updateReview,
    deleteReview
};
