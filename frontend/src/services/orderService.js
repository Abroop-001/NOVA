import api from "../api";

// Fetch all orders for the authenticated customer
export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

// Fetch single order details by ID
export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// Cancel an eligible customer order (Processing or Confirmed)
export const cancelOrder = async (orderId) => {
  const response = await api.post(`/orders/cancel/${orderId}`);
  return response.data;
};

export default {
  getMyOrders,
  getOrderDetails,
  cancelOrder
};
