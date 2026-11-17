import React from "react";
import { Eye } from "lucide-react";
import OrderStatusDropdown from "./OrderStatusDropdown";

const OrderTableAdmin = ({ orders = [], onViewOrder, onUpdateStatus, updatingId }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F9FAFB] text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3.5 px-4">Order ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50/70 transition">
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-gray-800">
                    {order.user?.username || order.deliveryAddress?.fullName || "Guest Customer"}
                  </p>
                  <p className="text-gray-400 text-[11px] truncate max-w-[150px]">
                    {order.user?.email || order.deliveryAddress?.phone || "N/A"}
                  </p>
                </td>
                <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-700">
                  <div className="flex flex-col">
                    <span>{order.paymentMethod || "COD"}</span>
                    <span className={`text-[10px] font-bold ${
                      order.paymentStatus === "PAID"
                        ? "text-emerald-600"
                        : order.paymentStatus === "FAILED"
                        ? "text-red-500"
                        : "text-amber-600"
                    }`}>
                      {order.paymentStatus || "PENDING"}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </td>
                <td className="py-3.5 px-4">
                  <OrderStatusDropdown
                    currentStatus={order.status}
                    onStatusChange={(newStatus) => onUpdateStatus(order._id, newStatus)}
                    disabled={updatingId === order._id}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onViewOrder(order)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTableAdmin;

