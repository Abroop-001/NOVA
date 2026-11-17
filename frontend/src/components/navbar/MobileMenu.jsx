import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { X, User, Package, MapPin, Heart, ShoppingBag, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MobileMenu = ({ isOpen, onClose, isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const { openAuthModal, logoutUser } = useAuth();
  if (!isOpen) return null;

  const handleLogout = () => {
    onClose();
    if (onLogout) {
      onLogout();
    } else {
      logoutUser();
    }
  };

  const handleOpenAuth = (view) => {
    onClose();
    openAuthModal(view);
  };

  const navLinks = [
    { label: "Nike", to: "/nike" },
    { label: "Adidas", to: "/adidas" },
    { label: "Puma", to: "/puma" },
    { label: "Featured", to: "/featured" },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white">
      <div className="h-20 flex items-center justify-between px-6 border-b border-[#EAEAEA]">
        <Link to="/" onClick={onClose} className="text-2xl font-bold tracking-[4px] text-[#242321]">
          BRAND
        </Link>
        <button type="button" onClick={onClose} className="p-2 text-[#292722] hover:opacity-70 transition cursor-pointer">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Collections</span>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `text-base font-semibold tracking-wide transition ${isActive ? "text-[#171717] underline underline-offset-8" : "text-[#514D47]"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-[#F0F0F0]" />

          <div className="flex flex-col space-y-3 text-sm font-medium text-[#171717]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Account & Shopping</span>

            <Link to="/cart" onClick={onClose} className="flex items-center gap-3 py-1.5">
              <ShoppingBag size={17} className="text-[#777777]" />
              <span>Shopping Bag</span>
            </Link>

            <Link to="/wishlist" onClick={onClose} className="flex items-center gap-3 py-1.5">
              <Heart size={17} className="text-[#777777]" />
              <span>Wishlist</span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={onClose} className="flex items-center gap-3 py-1.5">
                  <User size={17} className="text-[#777777]" />
                  <span>My Profile</span>
                </Link>
                <Link to="/orders" onClick={onClose} className="flex items-center gap-3 py-1.5">
                  <Package size={17} className="text-[#777777]" />
                  <span>My Orders</span>
                </Link>
                <Link to="/addresses" onClick={onClose} className="flex items-center gap-3 py-1.5">
                  <MapPin size={17} className="text-[#777777]" />
                  <span>My Addresses</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-1.5 text-red-600 w-full text-left cursor-pointer"
                >
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenAuth("login")}
                  className="flex items-center gap-3 py-1.5 text-left cursor-pointer"
                >
                  <LogIn size={17} className="text-[#777777]" />
                  <span>Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenAuth("signup")}
                  className="flex items-center gap-3 py-1.5 text-left cursor-pointer"
                >
                  <UserPlus size={17} className="text-[#777777]" />
                  <span>Create Account</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

