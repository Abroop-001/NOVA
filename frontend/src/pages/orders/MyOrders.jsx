import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OrderCard from "../../components/orders/OrderCard";
import EmptyOrders from "../../components/orders/EmptyOrders";
import { getMyOrders, cancelOrder } from "../../services/orderService";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.orders || []);
    } catch {
      setAlert({ type: "error", message: "Failed to load orders. Please refresh." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }
    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);
      setAlert({ type: "", message: "" });
      const res = await cancelOrder(orderId);
      setAlert({
        type: "success",
        message: res.message || "Order cancelled successfully.",
      });
      // Update order status in place
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
      );
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to cancel order.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="mb-8">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-[#777777] uppercase">
            Account History
          </span>
          <h1 className="text-2xl sm:text-3xl font-extralight tracking-tight text-[#171717] uppercase mt-1">
            My Orders
          </h1>
        </div>

        {alert.message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
              alert.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {alert.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{alert.message}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <OrderCard
                key={ord._id}
                order={ord}
                onCancelOrder={handleCancelOrder}
                isCancelling={cancellingId === ord._id}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
