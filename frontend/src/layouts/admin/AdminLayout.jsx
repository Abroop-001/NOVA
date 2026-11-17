import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminRoute from "./AdminRoute";

const TITLES = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/analytics": "Analytics",
  "/admin/returns": "Returns Management",
  "/admin/reviews": "Customer Reviews",
  "/admin/promotions": "Promotions & Discounts",
  "/admin/settings": "Settings",
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const location = useLocation();

  const title = TITLES[location.pathname] || "Admin Console";

  return (
    <AdminRoute>
      <div className="min-h-screen bg-[#F0F1F3] text-gray-900 font-sans flex">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <AdminHeader
            onOpenSidebar={() => setSidebarOpen(true)}
            search={globalSearch}
            setSearch={setGlobalSearch}
            title={title}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet context={{ globalSearch }} />
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminLayout;

