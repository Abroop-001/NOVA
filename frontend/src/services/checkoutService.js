import api from "../api";

// Fetch all saved addresses
export const getAddresses = async () => {
  const response = await api.get("/address");
  return response.data;
};

// Add a new address
export const addAddress = async (addressData) => {
  const response = await api.post("/address/add", addressData);
  return response.data;
};

// Set an address as default
export const setDefaultAddress = async (addressId) => {
  const response = await api.put(`/address/default/${addressId}`);
  return response.data;
};

// Place an order (COD)
export const placeOrder = async (addressId) => {
  const response = await api.post("/orders/place", { addressId });
  return response.data;
};

// Create Razorpay order
export const createRazorpayOrder = async (addressId) => {
  const response = await api.post("/orders/razorpay/create-order", { addressId });
  return response.data;
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (paymentData) => {
  const response = await api.post("/orders/razorpay/verify-payment", paymentData);
  return response.data;
};

// Get order details
export const getOrderDetails = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

