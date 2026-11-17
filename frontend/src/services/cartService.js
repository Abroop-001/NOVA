import api from "../api";

const GUEST_CART_KEY = "nova_guest_cart";

/**
 * Retrieve the guest cart from localStorage.
 * @returns {Array} Array of guest cart items.
 */
export const getGuestCart = () => {
  try {
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading guest cart:", error);
    return [];
  }
};

/**
 * Persist the guest cart to localStorage.
 * @param {Array} items - Array of cart items.
 */
export const saveGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    // Dispatch custom event so listeners can update cart counter
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Error saving guest cart:", error);
  }
};

/**
 * Fetch the cart:
 * If authenticated -> calls GET /api/cart from backend.
 * If guest -> reads from localStorage.
 * @returns {Promise<Array>} Array of normalized cart items.
 */
export const getCart = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const response = await api.get("/cart");
      if (response.data?.success && response.data.cart?.items) {
        return response.data.cart.items;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch user cart from server:", error);
      // Fallback to guest cart if server fails or token expired
      return getGuestCart();
    }
  }

  return getGuestCart();
};

/**
 * Add an item to the cart:
 * If authenticated -> calls POST /api/cart/add.
 * If guest -> adds/increments in localStorage guest cart.
 *
 * @param {Object} product - Product object
 * @param {number} size - Selected shoe size
 * @param {number} [quantity=1] - Quantity to add
 * @param {string} [color=""] - Selected color
 * @returns {Promise<Object>} Result object { success, items }
 */
export const addToCart = async (product, size, quantity = 1, color = "") => {
  const token = localStorage.getItem("token");
  const productId = product._id || product.id;

  if (token) {
    const response = await api.post("/cart/add", {
      productId,
      quantity,
      size,
      color,
    });
    window.dispatchEvent(new Event("cartUpdated"));
    return {
      success: true,
      message: response.data?.message || "Added to cart",
    };
  }

  // Guest cart logic
  const guestItems = getGuestCart();
  const existingIndex = guestItems.findIndex(
    (item) =>
      (item.product._id || item.product.id) === productId &&
      Number(item.size) === Number(size)
  );

  const maxStock = product.stock || 99;

  if (existingIndex > -1) {
    const currentQty = guestItems[existingIndex].quantity;
    const newQty = Math.min(currentQty + quantity, maxStock);
    guestItems[existingIndex].quantity = newQty;
  } else {
    guestItems.push({
      _id: `guest_${productId}_${size}_${Date.now()}`,
      product: {
        _id: productId,
        id: productId,
        name: product.name,
        brand: product.brand,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images || [product.image],
        image: product.image || product.images?.[0],
        stock: product.stock,
        category: product.category,
      },
      size,
      quantity: Math.min(quantity, maxStock),
      color: color || product.colors?.[0] || "",
    });
  }

  saveGuestCart(guestItems);
  return {
    success: true,
    message: "Added to cart",
    items: guestItems,
  };
};

/**
 * Update quantity of a cart item.
 *
 * @param {string} itemId - Item ID (_id)
 * @param {number} quantity - New quantity
 * @returns {Promise<void>}
 */
export const updateCartQuantity = async (itemId, quantity) => {
  const token = localStorage.getItem("token");

  if (token && !itemId.startsWith("guest_")) {
    await api.put(`/cart/update/${itemId}`, { quantity });
    window.dispatchEvent(new Event("cartUpdated"));
    return;
  }

  // Guest update
  const guestItems = getGuestCart();
  const itemIndex = guestItems.findIndex((item) => item._id === itemId);
  if (itemIndex > -1) {
    guestItems[itemIndex].quantity = Math.max(1, quantity);
    saveGuestCart(guestItems);
  }
};

/**
 * Remove an item from the cart.
 *
 * @param {string} itemId - Item ID (_id)
 * @returns {Promise<void>}
 */
export const removeCartItem = async (itemId) => {
  const token = localStorage.getItem("token");

  if (token && !itemId.startsWith("guest_")) {
    await api.delete(`/cart/remove/${itemId}`);
    window.dispatchEvent(new Event("cartUpdated"));
    return;
  }

  // Guest remove
  const guestItems = getGuestCart();
  const updatedItems = guestItems.filter((item) => item._id !== itemId);
  saveGuestCart(updatedItems);
};

/**
 * Merge the guest cart into the MongoDB user cart after successful login.
 * Calls POST /api/cart/merge and clears the guest cart upon success.
 */
export const mergeGuestCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const guestItems = getGuestCart();
  if (!guestItems || guestItems.length === 0) return;

  // Format guest items into the structure expected by POST /api/cart/merge
  const formattedItems = guestItems
    .map((item) => {
      const productId = item.product?._id || item.product?.id || item.productId || item.product;
      return {
        productId,
        quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
        size: Number(item.size),
        color: item.color || "",
      };
    })
    .filter((item) => item.productId && !isNaN(item.size));

  if (formattedItems.length === 0) {
    localStorage.removeItem(GUEST_CART_KEY);
    return;
  }

  try {
    const res = await api.post("/cart/merge", { items: formattedItems });
    // Clear guest cart from localStorage only after successful merge
    localStorage.removeItem(GUEST_CART_KEY);
    window.dispatchEvent(new Event("cartUpdated"));
    return res.data;
  } catch (error) {
    console.error("Failed to merge guest cart into user account:", error);
  }
};

export default {
  getCart,
  addToCart,
  updateCartQuantity,
  removeCartItem,
  mergeGuestCart,
  getGuestCart,
  saveGuestCart,
};

