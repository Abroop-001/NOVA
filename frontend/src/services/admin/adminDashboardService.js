import api from "../../api";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export const getRecentOrders = async () => {
  const response = await api.get("/dashboard/recent-orders");
  return response.data;
};

export const getSalesOverview = async (params = {}) => {
  const response = await api.get("/dashboard/sales-overview", { params });
  return response.data;
};

// Fetch detailed time-based sales analytics (daily, weekly, monthly, custom date range)
export const getSalesAnalytics = async (params = {}) => {
  const response = await api.get("/dashboard/sales-analytics", { params });
  return response.data;
};

// Fetch real best-selling products from GET /api/dashboard/best-sellers
export const getBestSellers = async (limit = 5) => {
  const response = await api.get(`/dashboard/best-sellers?limit=${limit}`);
  return response.data;
};

// Fetch real brand-wise sales from GET /api/dashboard/brand-sales
export const getBrandSales = async () => {
  const response = await api.get("/dashboard/brand-sales");
  return response.data;
};

export default {
  getDashboardStats,
  getRecentOrders,
  getSalesOverview,
  getSalesAnalytics,
  getBestSellers,
  getBrandSales
};
