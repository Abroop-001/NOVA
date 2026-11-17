import api from "../../api";

export const getAllOrders = async () => {
  const response = await api.get("/orders/admin/all");
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/admin/status/${orderId}`, { status });
  return response.data;
};

