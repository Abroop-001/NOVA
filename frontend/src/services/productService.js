import api from "../api";

/**
 * Fetch products with optional query filters and pagination.
 *
 * @param {Object} params - Query parameters
 * @param {string} [params.brand] - Filter by brand ("Nike", "Adidas", "Puma")
 * @param {string} [params.category] - Filter by category
 * @param {string} [params.search] - Search product name
 * @param {number|string} [params.minPrice] - Minimum price
 * @param {number|string} [params.maxPrice] - Maximum price
 * @param {number|string} [params.size] - Filter by available size
 * @param {string} [params.sort] - Sort order: "newest" | "price_low" | "price_high"
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Products per page
 * @returns {Promise<Object>} API response data { success, products, totalProducts, totalPages, currentPage }
 */
export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

/**
 * Fetch a single product by MongoDB _id.
 *
 * @param {string} id - Product ObjectId
 * @returns {Promise<Object>} API response data { success, product }
 */
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export default {
  getProducts,
  getProductById,
};

