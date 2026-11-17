import React, { useState } from "react";

const AdminSalesChart = ({
  salesData = [],
  year,
  activeFilter = "monthly",
  onFilterChange,
  filterOptions = ["daily", "weekly", "monthly", "yearly"],
  title = "Sales Overview",
  subtitle,
  loading = false,
}) => {
  const [internalFilter, setInternalFilter] = useState(activeFilter);
  const [metric, setMetric] = useState("revenue"); // "revenue" or "orders"

  const currentFilter = onFilterChange ? activeFilter : internalFilter;

  const handleFilterClick = (tab) => {
    setInternalFilter(tab);
    if (onFilterChange) onFilterChange(tab);
  };

  const getVal = (item) =>
    metric === "revenue" ? item.totalRevenue || 0 : item.ordersCount || 0;

  const maxVal = Math.max(...salesData.map(getVal), 1);
  const totalInChart = salesData.reduce((acc, d) => acc + (d.totalRevenue || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              ₹{totalInChart.toLocaleString("en-IN")} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {subtitle || `Revenue & order trends for ${year || new Date().getFullYear()}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector: Revenue / Orders */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMetric("revenue")}
              className={`px-2.5 py-1 rounded-md transition ${
                metric === "revenue"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Revenue (₹)
            </button>
            <button
              type="button"
              onClick={() => setMetric("orders")}
              className={`px-2.5 py-1 rounded-md transition ${
                metric === "orders"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Orders (#)
            </button>
          </div>

          {/* Period Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-xl">
            {filterOptions.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleFilterClick(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition cursor-pointer ${
                  currentFilter === tab
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      {loading ? (
        <div className="h-64 bg-gray-50 animate-pulse rounded-xl flex items-center justify-center text-xs text-gray-400">
          Loading sales analytics...
        </div>
      ) : salesData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
          No sales recorded for this timeframe.
        </div>
      ) : (
        <div className="h-64 flex items-end gap-1.5 sm:gap-3 pt-6 pb-2 px-2 border-b border-gray-100 overflow-x-auto">
          {salesData.map((item, idx) => {
            const val = getVal(item);
            const heightPct = Math.round((val / maxVal) * 100);
            const label =
              item.label ||
              (item.month ? item.month.slice(0, 3) : item.date || item.week || `#${idx + 1}`);

            return (
              <div
                key={idx}
                className="flex-1 min-w-[22px] flex flex-col items-center gap-2 h-full justify-end group"
              >
                <div className="relative w-full flex justify-center">
                  <div className="absolute -top-12 hidden group-hover:flex flex-col items-center bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded-md whitespace-nowrap z-20 shadow-md">
                    <span>₹{(item.totalRevenue || 0).toLocaleString("en-IN")}</span>
                    <span className="text-gray-300 font-normal">
                      {item.ordersCount || 0} {item.ordersCount === 1 ? "order" : "orders"}
                    </span>
                  </div>
                  <div
                    style={{ height: `${Math.max(heightPct, 6)}%` }}
                    className="w-full max-w-[28px] bg-blue-100 group-hover:bg-blue-600 rounded-t-md transition-all duration-300"
                  />
                </div>
                <span
                  title={label}
                  className="text-[10px] font-medium text-gray-400 truncate max-w-[42px] text-center"
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSalesChart;
