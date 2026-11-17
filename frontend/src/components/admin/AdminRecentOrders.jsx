import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

const STATUS_CLASSES = {
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const AdminRecentOrders = ({ orders = [] }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
          <p className="text-xs text-gray-500 mt-0.5">Latest purchase activity</p>
        </div>
        <Link
          to="/admin/orders"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View All <ArrowRight size={13} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <ShoppingBag size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-xs">No recent orders recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => {
                const statusCls =
                  STATUS_CLASSES[order.status] || "bg-gray-50 text-gray-700";
                const displayId = order.orderNumber
                  ? order.orderNumber
                  : `#${order._id.slice(-6).toUpperCase()}`;

                return (
                  <tr key={order._id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-semibold text-gray-800">
                      {displayId}
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.user?.username || order.user?.email || "Customer"}
                    </td>
                    <td className="py-3 text-gray-500 font-medium">
                      <span className="text-[11px] uppercase tracking-wide">
                        {order.paymentMethod || "COD"}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-gray-900">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase ${statusCls}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRecentOrders;
