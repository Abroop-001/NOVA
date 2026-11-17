import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, User, Settings, LogOut } from "lucide-react";

const AdminHeader = ({ onOpenSidebar, search, setSearch, title = "Dashboard" }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-gray-900 hidden sm:block whitespace-nowrap">
          {title}
        </h1>

        <div className="relative w-full max-w-xs ml-2 sm:ml-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            value={search || ""}
            onChange={(e) => setSearch && setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg outline-none focus:border-blue-600 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              AD
            </div>
            <span className="text-xs font-semibold text-gray-800 hidden md:block">
              Admin
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-1.5 z-50 text-xs">
              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <User size={14} /> Profile & Store
              </Link>
              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <Settings size={14} /> Settings
              </Link>
              <div className="my-1 border-t border-gray-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

