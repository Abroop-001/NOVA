import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import OrderTableAdmin from "../../components/admin/orders/OrderTableAdmin";
import OrderDetailModal from "../../components/admin/orders/OrderDetailModal";
import { getAllOrders, updateOrderStatus } from "../../services/admin/adminOrderService";

const STATUS_TABS = ["All", "Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      order._id.toLowerCase().includes(term) ||
      (order.orderNumber && order.orderNumber.toLowerCase().includes(term)) ||
      (order.user?.username && order.user.username.toLowerCase().includes(term)) ||
      (order.deliveryAddress?.fullName && order.deliveryAddress.fullName.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {STATUS_TABS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl h-80 animate-pulse border border-gray-200" />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-sm">No orders found.</p>
        </div>
      ) : (
        <OrderTableAdmin
          orders={filteredOrders}
          onViewOrder={(order) => setSelectedOrder(order)}
          onUpdateStatus={handleStatusUpdate}
          updatingId={updatingId}
        />
      )}

      <OrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default AdminOrders;

