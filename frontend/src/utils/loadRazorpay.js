/**
 * Dynamically load Razorpay checkout script
 * @returns {Promise<boolean>}
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout script");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export default loadRazorpay;
