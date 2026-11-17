import api from "../../api";

// Fetch all customer reviews across all products with filtering & pagination
export const getAllAdminReviews = async (params = {}) => {
  const { rating, page = 1, limit = 10, search = "" } = params;
  const queryParams = new URLSearchParams();

  if (rating) {
    queryParams.append("rating", rating);
  }
  if (page) {
    queryParams.append("page", page);
  }
  if (limit) {
    queryParams.append("limit", limit);
  }
  if (search && search.trim()) {
    queryParams.append("search", search.trim());
  }

  const response = await api.get(`/reviews/admin/all?${queryParams.toString()}`);
  return response.data;
};

// Fetch reviews for a specific product
export const getProductReviews = async (productId) => {
  const response = await api.get(`/reviews/product/${productId}`);
  return response.data;
};

// Delete a customer review (Admin privilege)
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

export default {
  getAllAdminReviews,
  getProductReviews,
  deleteReview
};
