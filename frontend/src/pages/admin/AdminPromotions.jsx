import React, { useState } from "react";
import { Tag, Plus, Check, Trash2 } from "lucide-react";

const INITIAL_PROMOS = [
  { id: "1", code: "NOVA10", discount: "10%", type: "Percentage", status: "Active", expiry: "31 Dec 2026" },
  { id: "2", code: "SNEAKER20", discount: "20%", type: "Percentage", status: "Active", expiry: "15 Jan 2027" },
];

const AdminPromotions = () => {
  const [promos, setPromos] = useState(INITIAL_PROMOS);
  const [showAdd, setShowAdd] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setPromos((prev) => [
      { id: Date.now().toString(), code: newCode.toUpperCase(), discount: `${newDiscount}%`, type: "Percentage", status: "Active", expiry: "30 Days" },
      ...prev,
    ]);
    setNewCode("");
    setNewDiscount("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Discount Campaigns</h3>
          <p className="text-xs text-gray-500 mt-0.5">Manage customer promo codes and checkout discounts</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          <Plus size={15} /> Add Promo Code
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-5 border border-blue-200 shadow-xs flex flex-wrap items-center gap-3 text-xs">
          <input placeholder="Promo Code (e.g. FLASH30)" required value={newCode} onChange={(e) => setNewCode(e.target.value)} className="h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600 uppercase" />
          <input type="number" placeholder="Discount %" required value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} className="h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600 w-28" />
          <button type="submit" className="px-5 h-10 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-1"><Check size={14} /> Save</button>
          <button type="button" onClick={() => setShowAdd(false)} className="px-4 h-10 border border-gray-200 font-bold rounded-xl text-gray-600">Cancel</button>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F9FAFB] text-gray-500 font-bold uppercase border-b border-gray-200">
            <tr>
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Type</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {promos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/70">
                <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                  <Tag size={13} className="text-blue-600" /> {p.code}
                </td>
                <td className="p-4 font-bold text-emerald-600">{p.discount}</td>
                <td className="p-4 text-gray-600">{p.type}</td>
                <td className="p-4 text-gray-600">{p.expiry}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase">{p.status}</span></td>
                <td className="p-4 text-right">
                  <button type="button" onClick={() => setPromos(promos.filter((x) => x.id !== p.id))} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPromotions;

