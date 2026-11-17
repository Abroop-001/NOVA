import { useState } from "react";
import { loadRazorpay } from "../utils/loadRazorpay";
import { createRazorpayOrder, verifyRazorpayPayment } from "../services/checkoutService";

export const useRazorpayCheckout = ({ contact, selectedAddressId, setOrderError, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const startPayment = async () => {
    setOrderError(null);

    const isScriptLoaded = await loadRazorpay();
    if (!isScriptLoaded) {
      setOrderError("Unable to load Razorpay checkout. Please check your connection.");
      return;
    }

    try {
      setIsProcessing(true);

      const orderData = await createRazorpayOrder(selectedAddressId);
      if (!orderData.success) {
        setIsProcessing(false);
        setOrderError(orderData.message || "Failed to create payment order.");
        return;
      }

      const keyId = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!keyId) {
        setIsProcessing(false);
        setOrderError("Razorpay Key ID is not configured. Please add RAZORPAY_KEY_ID to backend or frontend .env.");
        return;
      }

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "NOVA",
        description: "Sneaker Order Checkout",
        order_id: orderData.orderId,
        prefill: {
          email: contact.email.trim(),
          contact: contact.phone.trim(),
        },
        theme: {
          color: "#111111",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setOrderError("Payment cancelled by customer.");
          },
        },
        handler: async (response) => {
          try {
            const verifyRes = await verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              addressId: selectedAddressId,
            });

            if (verifyRes.success && verifyRes.order) {
              window.dispatchEvent(new Event("cartUpdated"));
              if (onSuccess) onSuccess(verifyRes.order);
            } else {
              setOrderError(verifyRes.message || "Payment verification failed.");
            }
          } catch (err) {
            setOrderError(err.response?.data?.message || "Payment verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (failRes) => {
        setIsProcessing(false);
        setOrderError(failRes.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      setIsProcessing(false);
      setOrderError(err.response?.data?.message || err.message || "Failed to initiate payment.");
    }
  };

  return { isProcessing, startPayment };
};

export default useRazorpayCheckout;
