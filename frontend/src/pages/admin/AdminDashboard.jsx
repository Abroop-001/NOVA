import React, { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import AdminStatCard from "../../components/admin/AdminStatCard";
import AdminSalesChart from "../../components/admin/AdminSalesChart";
import AdminRecentOrders from "../../components/admin/AdminRecentOrders";
import AdminBestSellers from "../../components/admin/AdminBestSellers";
import {
  getDashboardStats,
  getRecentOrders,
  getSalesOverview,
  getSalesAnalytics,
  getBestSellers,
} from "../../services/admin/adminDashboardService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [chartFilter, setChartFilter] = useState("monthly");
  const [chartLoading, setChartLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial load of overview metrics and tables
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, salesRes, bestSellersRes] = await Promise.all([
          getDashboardStats().catch(() => ({ stats: null })),
          getRecentOrders().catch(() => ({ orders: [] })),
          getSalesOverview().catch(() => ({ monthlySales: [] })),
          getBestSellers(4).catch(() => ({ bestSellers: [] })),
        ]);

        setStats(statsRes.stats);
        setRecentOrders(ordersRes.orders || []);
        setSalesData(salesRes.monthlySales || []);
        setBestSellers(bestSellersRes.bestSellers || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle chart period tab change (daily, weekly, monthly, yearly)
  const handleChartFilterChange = async (tab) => {
    try {
      setChartFilter(tab);
      setChartLoading(true);
      const res = await getSalesAnalytics({ period: tab });
      setSalesData(res.timeline || []);
    } catch {
      // fallback
    } finally {
      setChartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-200" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-2xl border border-gray-200" />
      </div>
    );
  }

  const revenueBadge = stats?.revenueTrendPercent != null
    ? `${stats.revenueTrendPercent >= 0 ? "+" : ""}${stats.revenueTrendPercent}% vs last mo`
    : `${stats?.deliveredOrders || 0} delivered`;

  return (
    <div className="space-y-6">
      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`}
          icon={DollarSign}
          badge={revenueBadge}
          color="blue"
        />
        <AdminStatCard
          title="Total Orders"
          value={(stats?.totalOrders || 0).toLocaleString()}
          icon={ShoppingCart}
          badge={`${stats?.pendingOrders || 0} processing`}
          color="emerald"
        />
        <AdminStatCard
          title="Total Products"
          value={(stats?.totalProducts || 0).toLocaleString()}
          icon={Package}
          badge={`${stats?.totalProducts || 0} in catalog`}
          color="amber"
        />
        <AdminStatCard
          title="Total Customers"
          value={(stats?.totalCustomers || 0).toLocaleString()}
          icon={Users}
          badge={`${stats?.totalCustomers || 0} registered`}
          color="purple"
        />
      </div>

      {/* Dynamic Sales Trend Chart */}
      <AdminSalesChart
        salesData={salesData}
        year={new Date().getFullYear()}
        activeFilter={chartFilter}
        onFilterChange={handleChartFilterChange}
        loading={chartLoading}
      />

      {/* Two Column Grid: Recent Orders & Top Footwear */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AdminRecentOrders orders={recentOrders} />
        </div>
        <div className="lg:col-span-5">
          <AdminBestSellers products={bestSellers} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
