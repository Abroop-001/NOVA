import React, { useState } from "react";
import { RotateCcw, Search, CheckCircle, XCircle } from "lucide-react";

const AdminReturns = () => {
  const [search, setSearch] = useState("");
  const [returns, setReturns] = useState([]);

  return (
    <div className="space-y-6">
      {/* Header filter */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search return requests by order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
          />
        </div>
        <span className="text-xs font-semibold text-gray-500">
          0 Pending Returns
        </span>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
            No Return Requests
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
            There are currently no active footwear return or refund claims submitted by customers.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
              <tr>
                <th className="p-4">Return ID</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>{/* Handled when backend returns exist */}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReturns;

