import React from "react";
import { X, MapPin, Package, CreditCard } from "lucide-react";

const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 pt-4 text-xs">
          {/* Items */}
          <div>
            <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Package size={14} className="text-blue-600" /> Ordered Silhouettes
            </h4>
            <div className="space-y-2.5 divide-y divide-gray-50">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 pt-2">
                  <div className="w-12 h-12 rounded-lg bg-[#F5F5F2] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img src={item.image || "/hero-shoe.png"} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.name}</p>
                    <p className="text-gray-500 text-[11px]">Size: UK {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="pt-3 border-t border-gray-100">
            <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-600" /> Delivery Details
            </h4>
            <div className="bg-gray-50 p-3.5 rounded-xl text-gray-700 leading-relaxed">
              <p className="font-bold text-gray-900">{order.deliveryAddress?.fullName}</p>
              <p>{order.deliveryAddress?.addressLine1}{order.deliveryAddress?.addressLine2 ? `, ${order.deliveryAddress?.addressLine2}` : ""}</p>
              <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} – {order.deliveryAddress?.pincode}</p>
              <p className="text-gray-500 mt-1">Phone: {order.deliveryAddress?.phone}</p>
            </div>
          </div>

          {/* Payment & Status */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex flex-col gap-1 text-gray-600">
              <div className="flex items-center gap-2">
                <CreditCard size={15} />
                <span>Payment: <strong>{order.paymentMethod || "COD"}</strong></span>
              </div>
              {order.paymentStatus && (
                <span className={`text-[11px] font-bold ${
                  order.paymentStatus === "PAID"
                    ? "text-emerald-600"
                    : order.paymentStatus === "FAILED"
                    ? "text-red-500"
                    : "text-amber-600"
                }`}>
                  Status: {order.paymentStatus}
                  {order.razorpayPaymentId ? ` · ${order.razorpayPaymentId}` : ""}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-gray-500 block text-[11px]">Total Paid</span>
              <span className="text-base font-extrabold text-blue-600">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;

