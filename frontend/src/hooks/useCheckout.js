import { useState, useEffect, useCallback } from "react";
import { getCart } from "../services/cartService";
import {
  getAddresses,
  addAddress as addAddressAPI,
  placeOrder as placeOrderAPI,
} from "../services/checkoutService";

const useCheckout = () => {
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);

  // Contact state
  const [contact, setContact] = useState({ email: "", phone: "" });

  // Order state
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Load cart
  const loadCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const items = await getCart();
      setCartItems(items || []);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Load addresses
  const loadAddresses = useCallback(async () => {
    try {
      setAddressLoading(true);
      const data = await getAddresses();
      const list = data.addresses || [];
      setAddresses(list);
      // Auto-select default address
      const def = list.find((a) => a.isDefault);
      if (def) setSelectedAddressId(def._id);
      else if (list.length > 0) setSelectedAddressId(list[0]._id);
    } catch {
      setAddresses([]);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
    loadAddresses();
  }, [loadCart, loadAddresses]);

  // Add new address
  const addAddress = async (addressData) => {
    const data = await addAddressAPI(addressData);
    if (data.success && data.address) {
      setAddresses((prev) => [data.address, ...prev]);
      setSelectedAddressId(data.address._id);
    }
    return data;
  };

  // Totals
  const subtotal = cartItems.reduce((acc, item) => {
    if (!item.product) return acc;
    const price = Number(item.product.price) || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const total = cartItems.reduce((acc, item) => {
    if (!item.product) return acc;
    const orig = Number(item.product.price) || 0;
    const disc = Number(item.product.discountPrice);
    const effective =
      item.product.discountPrice != null && disc < orig ? disc : orig;
    return acc + effective * (item.quantity || 1);
  }, 0);

  const discount = subtotal - total;
  const itemCount = cartItems.reduce((a, i) => a + (i.quantity || 1), 0);

  // Place order
  const placeOrder = async () => {
    setOrderError(null);

    if (!selectedAddressId) {
      setOrderError("Please select a delivery address");
      return null;
    }

    try {
      setPlacing(true);
      const data = await placeOrderAPI(selectedAddressId);
      if (data.success) {
        return data.order;
      }
      setOrderError(data.message || "Failed to place order");
      return null;
    } catch (err) {
      setOrderError(
        err.response?.data?.message || err.message || "Failed to place order"
      );
      return null;
    } finally {
      setPlacing(false);
    }
  };

  return {
    cartItems,
    cartLoading,
    addresses,
    addressLoading,
    selectedAddressId,
    setSelectedAddressId,
    contact,
    setContact,
    addAddress,
    loadAddresses,
    subtotal,
    total,
    discount,
    itemCount,
    placing,
    orderError,
    setOrderError,
    placeOrder,
  };
};

export default useCheckout;

