import React from "react";

const STATUSES = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const OrderStatusDropdown = ({ currentStatus, onStatusChange, disabled }) => {
  return (
    <select
      value={currentStatus}
      disabled={disabled}
      onChange={(e) => onStatusChange(e.target.value)}
      className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-600 cursor-pointer disabled:opacity-50"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default OrderStatusDropdown;

