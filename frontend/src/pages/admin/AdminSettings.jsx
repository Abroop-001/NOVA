import React, { useState } from "react";
import { Check, Shield, Store, Bell } from "lucide-react";

const AdminSettings = () => {
  const [storeName, setStoreName] = useState("NOVA Footwear");
  const [supportEmail, setSupportEmail] = useState("concierge@nova.com");
  const [currency, setCurrency] = useState("INR (₹)");
  const [freeShipping, setFreeShipping] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-6 text-xs">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Store size={18} className="text-blue-600" /> Store Preferences
          </h3>
          <p className="text-gray-500 mt-0.5">Global configuration for customer experience and operations</p>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2 font-medium">
            <Check size={15} /> Store settings saved successfully.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Store Name</label>
            <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Support Email</label>
            <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
          </div>
          <div>
            <label className="font-bold text-gray-700 block mb-1">Default Currency</label>
            <input value={currency} disabled className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="shipping" checked={freeShipping} onChange={(e) => setFreeShipping(e.target.checked)} className="rounded" />
            <label htmlFor="shipping" className="font-bold text-gray-700">Enable Complimentary Double-Boxed Shipping</label>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs">
            <Check size={14} /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;

