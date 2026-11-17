import React from "react";
import { AlertCircle } from "lucide-react";

const BRAND_COLORS = {
  Nike: { bg: "bg-blue-600", text: "text-blue-600" },
  Adidas: { bg: "bg-emerald-600", text: "text-emerald-600" },
  Puma: { bg: "bg-purple-600", text: "text-purple-600" },
};

const AnalyticsBrandChart = ({ brandStats = [], loading = false, error = "" }) => {
  const totalRevenue = brandStats.reduce((acc, b) => acc + (b.revenue || 0), 0) || 1;
  const totalUnits = brandStats.reduce((acc, b) => acc + (b.unitsSold || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-gray-900">Brand Performance</h3>
        <span className="text-xs font-semibold text-gray-500">
          {totalUnits} total units sold
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-6">Units sold and revenue breakdown for Nike, Adidas & Puma</p>

      {loading ? (
        <div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
      ) : error ? (
        <div className="p-4 text-center text-xs text-red-500 flex items-center justify-center gap-1.5">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* Stacked Progress Bar */}
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex mb-6">
            {brandStats.map((b) => {
              const pct = totalRevenue > 1 ? Math.round(((b.revenue || 0) / totalRevenue) * 100) : 33;
              const style = BRAND_COLORS[b.brand] || { bg: "bg-gray-400" };
              return (
                <div
                  key={b.brand}
                  style={{ width: `${pct}%` }}
                  className={`${style.bg} h-full transition-all`}
                  title={`${b.brand}: ${pct}%`}
                />
              );
            })}
          </div>

          {/* Breakdown cards */}
          <div className="space-y-3 text-xs">
            {brandStats.map((b) => {
              const pct = totalRevenue > 1 ? Math.round(((b.revenue || 0) / totalRevenue) * 100) : 0;
              const style = BRAND_COLORS[b.brand] || { bg: "bg-gray-400", text: "text-gray-600" };
              const units = b.unitsSold || 0;
              const revenue = b.revenue || 0;

              return (
                <div key={b.brand} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${style.bg}`} />
                    <span className="font-bold text-gray-800">{b.brand}</span>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {units} {units === 1 ? "unit" : "units"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-medium">{pct}%</span>
                    <span className="font-bold text-gray-900">₹{revenue.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsBrandChart;
