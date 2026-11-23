/**
 * Google Analytics 4 (GA4) Integration for NOVA
 * Lightweight vanilla gtag tracking with zero external dependencies.
 */

export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-T1H8L2PJRN";

/**
 * Safe helper to invoke window.gtag
 */
export const gtag = (...args) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
};

/**
 * Track route changes and page views in React Router.
 *
 * @param {string} [path] - Current route path (defaults to window.location.pathname + search)
 * @param {string} [title] - Page title (defaults to document.title)
 */
export const trackPageView = (path, title) => {
  const pagePath =
    path || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  const pageTitle =
    title || (typeof document !== "undefined" ? document.title : "NOVA | Sneaker Store");
  const pageLocation =
    typeof window !== "undefined" ? window.location.href : "";

  gtag("event", "page_view", {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: pageLocation,
    send_to: GA_MEASUREMENT_ID,
  });
};

/**
 * Track user signup completed.
 * Stored strictly without PII (no name, email, phone, or address).
 *
 * @param {string} [method='email'] - Signup method ('email' or 'google')
 */
export const trackSignUp = (method = "email") => {
  gtag("event", "sign_up", {
    method,
  });
};

/**
 * Track product added to cart.
 *
 * @param {Object} product - Product details
 * @param {number|string} size - Shoe size
 * @param {number} [quantity=1] - Quantity added
 * @param {string} [color=''] - Color variant
 */
export const trackAddToCart = (product, size, quantity = 1, color = "") => {
  if (!product) return;

  const productId = product._id || product.id || "";
  const origPrice = Number(product.price) || 0;
  const discPrice = Number(product.discountPrice);
  const effectivePrice =
    product.discountPrice != null && discPrice < origPrice ? discPrice : origPrice;
  const qty = Number(quantity) || 1;

  gtag("event", "add_to_cart", {
    currency: "INR",
    value: effectivePrice * qty,
    items: [
      {
        item_id: String(productId),
        item_name: product.name || "Sneaker",
        item_brand: product.brand || "NOVA",
        item_category: product.category || "Sneakers",
        price: effectivePrice,
        quantity: qty,
        item_variant: size ? `UK ${size}` : color || undefined,
      },
    ],
  });
};

/**
 * Track checkout initiated.
 *
 * @param {Array} cartItems - Current items in cart
 * @param {number} totalAmount - Total order value
 */
export const trackBeginCheckout = (cartItems = [], totalAmount = 0) => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) return;

  const items = cartItems.map((item) => {
    const prod = item.product || {};
    const origPrice = Number(prod.price) || 0;
    const discPrice = Number(prod.discountPrice);
    const effectivePrice =
      prod.discountPrice != null && discPrice < origPrice
        ? discPrice
        : origPrice || Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;

    return {
      item_id: String(prod._id || prod.id || item.productId || ""),
      item_name: prod.name || item.name || "Sneaker",
      item_brand: prod.brand || item.brand || "NOVA",
      item_category: prod.category || "Sneakers",
      price: effectivePrice,
      quantity: qty,
      item_variant: item.size ? `UK ${item.size}` : undefined,
    };
  });

  gtag("event", "begin_checkout", {
    currency: "INR",
    value: Number(totalAmount) || 0,
    items,
  });
};

/**
 * Track purchase completed when an order is successfully placed.
 * PII (name, email, phone, physical address) is strictly omitted.
 * Uses sessionStorage deduplication to avoid duplicate events on page reload.
 *
 * @param {Object} order - Confirmed order object from backend
 */
export const trackPurchase = (order) => {
  if (!order) return;

  const transactionId = String(order.orderNumber || order._id || "");
  if (!transactionId) return;

  // Deduplication guard: track each completed order only once per browser session
  const dedupeKey = `ga_purchase_tracked_${transactionId}`;
  try {
    if (sessionStorage.getItem(dedupeKey)) {
      return;
    }
    sessionStorage.setItem(dedupeKey, "true");
  } catch {
    // If sessionStorage is unavailable or throws, proceed gracefully
  }

  const items = (order.items || []).map((item) => {
    return {
      item_id: String(item.product || item.productId || item._id || ""),
      item_name: item.name || "Sneaker",
      item_brand: item.brand || "NOVA",
      item_category: item.category || "Sneakers",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      item_variant: item.size ? `UK ${item.size}` : undefined,
    };
  });

  gtag("event", "purchase", {
    transaction_id: transactionId,
    value: Number(order.totalAmount) || 0,
    currency: "INR",
    tax: 0,
    shipping: 0,
    items,
  });
};
