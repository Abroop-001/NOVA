import api from "../../api";

// Fetch registered customers with search and pagination from GET /api/dashboard/customers
export const getCustomers = async (params = {}) => {
  const { search = "", page = 1, limit = 10 } = params;
  const queryParams = new URLSearchParams();

  if (search && search.trim()) {
    queryParams.append("search", search.trim());
  }
  if (page) {
    queryParams.append("page", page);
  }
  if (limit) {
    queryParams.append("limit", limit);
  }

  const response = await api.get(`/dashboard/customers?${queryParams.toString()}`);
  return response.data;
};

export default {
  getCustomers
};
