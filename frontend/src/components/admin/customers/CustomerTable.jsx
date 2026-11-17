import React from "react";
import { UserCheck } from "lucide-react";

const CustomerTable = ({ customers = [], onViewCustomer }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F9FAFB] text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Registration Date</th>
              <th className="py-3.5 px-4">Account Status</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => {
              const name = c.username || c.name || "Customer";
              const initial = name.charAt(0).toUpperCase();
              const regDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              }) : "N/A";

              return (
                <tr key={c.id || c._id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {initial}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{name}</p>
                        <p className="text-gray-400 text-[11px]">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-medium">{c.phone || "N/A"}</td>
                  <td className="py-3.5 px-4 text-gray-600">{regDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <UserCheck size={12} /> Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewCustomer && onViewCustomer(c)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
