import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getCart,
  updateCartQuantity,
  removeCartItem,
} from "../services/cartService";

export const useCart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart items
  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cartItems = await getCart();
      setItems(cartItems || []);
    } catch (err) {
      console.error("useCart load error:", err);
      setError(err.message || "Failed to load shopping bag");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();

    // Listen for custom cartUpdated events across the application
    const handleCartUpdated = () => {
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, [loadCart]);

  // Update Item Quantity
  const updateQuantity = useCallback(
    async (itemId, newQty) => {
      if (newQty < 1) return;

      // Optimistic state update
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, quantity: newQty } : item
        )
      );

      try {
        await updateCartQuantity(itemId, newQty);
      } catch (err) {
        console.error("Failed to update item quantity:", err);
        // Revert on failure
        loadCart();
      }
    },
    [loadCart]
  );

  // Remove Item
  const removeItem = useCallback(
    async (itemId) => {
      // Optimistic state update
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));

      try {
        await removeCartItem(itemId);
      } catch (err) {
        console.error("Failed to remove item from cart:", err);
        loadCart();
      }
    },
    [loadCart]
  );

  // Totals calculations
  const { itemCount, subtotal, originalTotal, discountTotal } = useMemo(() => {
    let count = 0;
    let sub = 0;
    let orig = 0;

    items.forEach((item) => {
      if (!item.product) return;
      const qty = item.quantity || 1;
      const originalPrice = Number(item.product.price) || 0;
      const effectivePrice =
        item.product.discountPrice != null &&
        Number(item.product.discountPrice) < originalPrice
          ? Number(item.product.discountPrice)
          : originalPrice;

      count += qty;
      sub += effectivePrice * qty;
      orig += originalPrice * qty;
    });

    const disc = orig > sub ? orig - sub : 0;

    return {
      itemCount: count,
      subtotal: sub,
      originalTotal: orig,
      discountTotal: disc,
    };
  }, [items]);

  // Complimentary delivery on all premium orders
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  return {
    items,
    loading,
    error,
    itemCount,
    subtotal,
    originalTotal,
    discountTotal,
    deliveryFee,
    total,
    updateQuantity,
    removeItem,
    refreshCart: loadCart,
  };
};

export default useCart;

