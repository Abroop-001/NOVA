import React from "react";

const STATUS_STYLES = {
  Processing: "bg-[#F5F5F5] text-[#555555] border-[#E5E5E5]",
  Confirmed: "bg-[#EEF4FF] text-[#1D4ED8] border-[#DBEAFE]",
  Shipped: "bg-[#FAF5FF] text-[#7E22CE] border-[#F3E8FF]",
  Delivered: "bg-[#ECFDF5] text-[#047857] border-[#D1FAE5]",
  Cancelled: "bg-[#FEF2F2] text-[#B91C1C] border-[#FEE2E2]",
};

const OrderStatusBadge = ({ status = "Processing" }) => {
  const badgeClass =
    STATUS_STYLES[status] || "bg-[#F5F5F5] text-[#555555] border-[#E5E5E5]";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-md border ${badgeClass}`}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;

