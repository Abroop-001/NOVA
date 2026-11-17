import React, { useState, useEffect, useCallback } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Layers } from "lucide-react";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminSalesChart from "../../components/admin/AdminSalesChart";
import AnalyticsBrandChart from "../../components/admin/analytics/AnalyticsBrandChart";
import AdminBestSellers from "../../components/admin/AdminBestSellers";
import {
  getSalesAnalytics,
  getBestSellers,
  getBrandSales
} from "../../services/admin/adminDashboardService";

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUnits: 0,
    averageOrderValue: 0
  });
  const [brandStats, setBrandStats] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const [analyticsRes, brandRes, bestSellersRes] = await Promise.all([
        getSalesAnalytics(params).catch(() => ({ timeline: [], summary: {} })),
        getBrandSales().catch(() => ({ brandSales: [] })),
        getBestSellers(5).catch(() => ({ bestSellers: [] })),
      ]);

      setSalesData(analyticsRes.timeline || []);
      setSummary(analyticsRes.summary || {
        totalRevenue: 0, totalOrders: 0, totalUnits: 0, averageOrderValue: 0
      });
      setBrandStats(brandRes.brandSales || []);
      setBestSellers(bestSellersRes.bestSellers || []);
    } catch {
      setError("Failed to load analytics data from server.");
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handlePreset = (p) => {
    setStartDate("");
    setEndDate("");
    setPeriod(p);
  };

  return (
    <div className="space-y-6">
      {/* Date Range & Preset Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "daily", label: "Last 7 Days" },
            { id: "30d", label: "Last 30 Days" },
            { id: "weekly", label: "Last 12 Weeks" },
            { id: "monthly", label: "This Year" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePreset(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                period === item.id && !startDate
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 bg-white"
          />
          <span className="text-gray-400 font-bold">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 bg-white"
          />
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Period Revenue"
          value={`₹${(summary.totalRevenue || 0).toLocaleString("en-IN")}`}
          icon={DollarSign}
          badge="Verified revenue"
          color="blue"
        />
        <AdminStatCard
          title="Period Orders"
          value={(summary.totalOrders || 0).toLocaleString()}
          icon={ShoppingBag}
          badge="Orders placed"
          color="emerald"
        />
        <AdminStatCard
          title="Pairs Sold"
          value={(summary.totalUnits || 0).toLocaleString()}
          icon={Layers}
          badge="Sneaker units"
          color="purple"
        />
        <AdminStatCard
          title="Avg Order Value"
          value={`₹${(summary.averageOrderValue || 0).toLocaleString("en-IN")}`}
          icon={TrendingUp}
          badge="Per order"
          color="amber"
        />
      </div>

      {/* Main Analytics Chart */}
      <AdminSalesChart
        salesData={salesData}
        title="Revenue & Demand Trends"
        subtitle={`Real-time sales aggregation for ${period}`}
        activeFilter={period}
        onFilterChange={(tab) => setPeriod(tab)}
        loading={loading}
      />

      {/* Brand Share & Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <AnalyticsBrandChart brandStats={brandStats} loading={loading} error={error} />
        </div>
        <div className="lg:col-span-6">
          <AdminBestSellers products={bestSellers} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
