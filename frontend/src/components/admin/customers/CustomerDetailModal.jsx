import React from "react";
import { X, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

const CustomerDetailModal = ({ customer, isOpen, onClose }) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">{customer.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Customer Profile & History</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 pt-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl text-gray-700">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <MapPin size={14} className="text-gray-400" />
              <span>{customer.city}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-blue-50/60 rounded-xl">
              <span className="text-[11px] font-bold text-blue-600 uppercase">Total Orders</span>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{customer.totalOrders}</p>
            </div>
            <div className="p-3.5 bg-emerald-50/60 rounded-xl">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">Lifetime Spending</span>
              <p className="text-lg font-bold text-gray-900 mt-0.5">₹{customer.totalSpent.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-blue-600" /> Recent Purchases
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-gray-50">
              {customer.orders?.map((ord) => (
                <div key={ord._id} className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800">#{ord._id.slice(-6).toUpperCase()}</span>
                    <span className="text-gray-400 text-[11px] block">{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">₹{ord.totalAmount?.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] font-semibold text-blue-600 block">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;

