import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getOrderDetails } from "../services/checkoutService";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetails(orderId);
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center space-y-4">
            <div className="w-16 h-16 bg-[#F0F0F0] rounded-full mx-auto" />
            <div className="h-6 w-48 bg-[#F0F0F0] rounded mx-auto" />
            <div className="h-4 w-64 bg-[#F5F5F5] rounded mx-auto" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-[#171717] mb-2">{error}</h2>
          <Link
            to="/home"
            className="mt-4 px-6 py-3 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition"
          >
            Go Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Success Icon */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-5">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase mb-2">
            Order Confirmed
          </h1>
          <p className="text-sm text-[#777777]">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Order Number */}
          <div className="flex items-center justify-between pb-5 border-b border-[#F0F0F0]">
            <div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-[#999999]">
                Order Number
              </p>
              <p className="text-base font-bold text-[#171717] mt-0.5">
                {order.orderNumber}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F5F5] rounded-lg">
              <Package size={14} className="text-[#555555]" />
              <span className="text-xs font-semibold text-[#555555] uppercase tracking-wider">
                {order.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#777777] mb-3">
              Items Ordered
            </p>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F5F5F2] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#171717] truncate">{item.name}</p>
                    <p className="text-xs text-[#777777]">
                      Size: UK {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#171717] shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="pt-5 border-t border-[#F0F0F0]">
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-[#777777] mb-2">
              Delivery Address
            </p>
            <p className="text-sm text-[#171717] leading-relaxed">
              {order.deliveryAddress.fullName}<br />
              {order.deliveryAddress.addressLine1}
              {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}<br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state} – {order.deliveryAddress.pincode}
            </p>
          </div>

          {/* Total */}
          <div className="flex justify-between items-baseline pt-5 border-t border-[#F0F0F0]">
            <div>
              <span className="text-sm font-bold text-[#171717]">
                {order.paymentMethod === "RAZORPAY"
                  ? "Total Paid (Razorpay)"
                  : "Total Amount (COD)"}
              </span>
              <p className="text-[11px] text-[#777777] mt-0.5">
                Status: {order.paymentStatus || (order.paymentMethod === "RAZORPAY" ? "PAID" : "PENDING")}
              </p>
            </div>
            <span className="text-xl font-extrabold text-[#171717]">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            to="/home"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition"
          >
            Continue Shopping
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;

