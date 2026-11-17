const Review = require("../models/reviewModel");

// GET /api/reviews/admin/all
const getAllReviewsAdmin = async (req, res) => {
    try {
        const { rating, productId, page = 1, limit = 10, search } = req.query;

        const filter = {};

        if (rating) {
            const numericRating = Number(rating);
            if (!isNaN(numericRating) && numericRating >= 1 && numericRating <= 5) {
                filter.rating = numericRating;
            }
        }

        if (productId) {
            filter.product = productId;
        }

        if (search && search.trim()) {
            filter.comment = { $regex: search.trim(), $options: "i" };
        }

        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
        const skip = (currentPage - 1) * perPage;

        const totalReviews = await Review.countDocuments(filter);

        const reviews = await Review.find(filter)
            .populate("user", "username email")
            .populate("product", "name brand images price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage);

        res.status(200).json({
            success: true,
            totalReviews,
            currentPage,
            totalPages: Math.ceil(totalReviews / perPage),
            reviews: reviews.map((r) => ({
                _id: r._id,
                id: r._id,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                customer: r.user
                    ? {
                          id: r.user._id,
                          username: r.user.username,
                          email: r.user.email
                      }
                    : { username: "Anonymous Customer", email: "N/A" },
                product: r.product
                    ? {
                          id: r.product._id,
                          name: r.product.name,
                          brand: r.product.brand,
                          image: r.product.images?.[0] || ""
                      }
                    : { name: "Deleted Product", brand: "N/A", image: "" }
            }))
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllReviewsAdmin
};
