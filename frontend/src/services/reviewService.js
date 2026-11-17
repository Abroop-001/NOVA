import api from "../api";

// Fetch customer reviews and average rating for a specific product
export const getProductReviews = async (productId) => {
  const response = await api.get(`/reviews/product/${productId}`);
  return response.data;
};

// Submit a new verified-purchase customer review
export const addReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};

export default {
  getProductReviews,
  addReview
};
