import api from "../api";

// Fetch all saved addresses for logged-in user
export const getAddresses = async () => {
  const response = await api.get("/address");
  return response.data;
};

// Add a new address
export const addAddress = async (addressData) => {
  const response = await api.post("/address/add", addressData);
  return response.data;
};

// Update an existing address
export const updateAddress = async (addressId, addressData) => {
  const response = await api.put(`/address/update/${addressId}`, addressData);
  return response.data;
};

// Delete an address
export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/address/delete/${addressId}`);
  return response.data;
};

// Set address as default
export const setDefaultAddress = async (addressId) => {
  const response = await api.put(`/address/default/${addressId}`);
  return response.data;
};

