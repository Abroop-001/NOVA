import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, AlertCircle } from "lucide-react";

const AdminBestSellers = ({ products = [], loading = false, error = "" }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900">Best-Selling Products</h3>
          <p className="text-xs text-gray-500 mt-0.5">Top-demand products by units sold & revenue</p>
        </div>
        <Link
          to="/admin/products"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Catalog <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-center text-xs text-red-500 flex items-center justify-center gap-1.5">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <Package size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-xs">No sales data recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.slice(0, 5).map((prod) => {
            const image = prod.image || prod.images?.[0] || "/hero-shoe.png";
            const units = prod.unitsSold != null ? prod.unitsSold : 0;
            const revenue = prod.revenue != null ? prod.revenue : (prod.price || 0) * units;

            return (
              <div
                key={prod.productId || prod._id || prod.id}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-[#F5F5F2] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={image}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-gray-400">
                      {prod.brand || "NOVA"}
                    </p>
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {prod.name}
                    </p>
                    <p className="text-[11px] font-semibold text-blue-600">
                      {units} {units === 1 ? "unit" : "units"} sold
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-gray-900">
                    ₹{revenue.toLocaleString("en-IN")}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Revenue
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBestSellers;
