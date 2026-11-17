import React from "react";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderCard = ({ order, onCancelOrder, isCancelling = false }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const canCancel = order.status === "Processing" || order.status === "Confirmed";

  const handleCancelClick = () => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      if (onCancelOrder) {
        onCancelOrder(order._id);
      }
    }
  };

  return (
    <div className="border border-[#EAEAEA] rounded-2xl bg-white p-5 sm:p-6 transition hover:border-[#CCCCCC]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F0F0F0]">
        <div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#999999]">
            Order #{order.orderNumber}
          </span>
          <p className="text-xs text-[#777777] mt-0.5">Placed on {formattedDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {canCancel && (
            <button
              type="button"
              disabled={isCancelling}
              onClick={handleCancelClick}
              className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition disabled:opacity-50"
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="py-4 space-y-3">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#F5F5F2] flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={item.image || "/hero-shoe.png"}
                alt={item.name}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#171717] truncate">
                {item.name}
              </h4>
              <p className="text-xs text-[#777777] mt-0.5">
                Size: UK {item.size} · Qty: {item.quantity}
              </p>
            </div>
            <p className="text-sm font-bold text-[#171717] shrink-0">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-[#F0F0F0] flex items-center justify-between">
        <div>
          <span className="text-[11px] text-[#777777] uppercase tracking-wider">
            Total Amount
          </span>
          <p className="text-base sm:text-lg font-extrabold text-[#171717]">
            ₹{order.totalAmount?.toLocaleString("en-IN")}
          </p>
        </div>
        <span className="text-xs text-[#777777] font-medium">
          Payment: {order.paymentMethod || "COD"}
          {order.paymentStatus ? ` · ${order.paymentStatus}` : ""}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
