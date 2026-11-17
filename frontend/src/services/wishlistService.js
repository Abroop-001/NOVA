import api from "../api";

const GUEST_WISHLIST_KEY = "nova_guest_wishlist";

export const getGuestWishlist = () => {
  try {
    const data = localStorage.getItem(GUEST_WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveGuestWishlist = (items) => {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("wishlistUpdated"));
  } catch (e) {
    console.error("Error saving guest wishlist:", e);
  }
};

export const getWishlist = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await api.get("/wishlist");
      if (response.data?.success && response.data.wishlist) {
        return response.data.wishlist.products || [];
      }
      return [];
    } catch (err) {
      console.error("Error fetching user wishlist:", err);
      return getGuestWishlist();
    }
  }
  return getGuestWishlist();
};

export const addToWishlist = async (product) => {
  const token = localStorage.getItem("token");
  const productId = product._id || product.id;

  if (token) {
    const response = await api.post("/wishlist/add", { productId });
    window.dispatchEvent(new Event("wishlistUpdated"));
    return response.data;
  }

  const items = getGuestWishlist();
  if (!items.some((p) => (p._id || p.id) === productId)) {
    items.push(product);
    saveGuestWishlist(items);
  }
  return { success: true };
};

export const removeFromWishlist = async (productId) => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    window.dispatchEvent(new Event("wishlistUpdated"));
    return response.data;
  }

  const items = getGuestWishlist().filter(
    (p) => (p._id || p.id) !== productId
  );
  saveGuestWishlist(items);
  return { success: true };
};

