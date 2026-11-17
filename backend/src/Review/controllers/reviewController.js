const { addReview } = require("./addReviewController");
const {
    getProductReviews,
    updateReview,
    deleteReview
} = require("./manageReviewController");

module.exports = {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview
};
