import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserDropdown = ({ isOpen, onClose, isLoggedIn, onLogout }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  let userRole = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) userRole = JSON.parse(rawUser)?.role;
  } catch (e) {}

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    onLogout();
    onClose();
    navigate("/");
  };

  const handleOpenAuth = (view) => {
    onClose();
    openAuthModal(view);
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#EAEAEA] bg-white p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {isLoggedIn ? (
        <div className="flex flex-col text-xs font-medium text-[#171717]">
          {(userRole === "admin" || userRole === "superadmin") && (
            <Link
              to="/admin"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-blue-600 bg-blue-50/50 hover:bg-blue-50 font-semibold transition mb-1"
            >
              <ShieldCheck size={15} className="text-blue-600" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF9F6] transition"
          >
            <User size={15} className="text-[#777777]" />
            <span>My Profile</span>
          </Link>

          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF9F6] transition"
          >
            <Package size={15} className="text-[#777777]" />
            <span>My Orders</span>
          </Link>

          <Link
            to="/addresses"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF9F6] transition"
          >
            <MapPin size={15} className="text-[#777777]" />
            <span>My Addresses</span>
          </Link>

          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF9F6] transition"
          >
            <Heart size={15} className="text-[#777777]" />
            <span>My Wishlist</span>
          </Link>

          <div className="my-1.5 border-t border-[#F0F0F0]" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50/70 transition w-full text-left cursor-pointer"
          >
            <LogOut size={15} className="text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col text-xs font-medium text-[#171717]">
          <button
            type="button"
            onClick={() => handleOpenAuth("login")}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF9F6] transition text-left cursor-pointer"
          >
            <LogIn size={15} className="text-[#777777]" />
            <span>Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAuth("signup")}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[#FAF9F6] transition text-left cursor-pointer"
          >
            <UserPlus size={15} className="text-[#777777]" />
            <span>Create Account</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

