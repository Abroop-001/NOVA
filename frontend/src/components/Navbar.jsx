import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserRound, ShoppingBag, Heart, Menu } from "lucide-react";
import UserDropdown from "./navbar/UserDropdown";
import MobileMenu from "./navbar/MobileMenu";
import { useAuth } from "../context/AuthContext";
import { getCart, getGuestCart } from "../services/cartService";
import { getWishlist } from "../services/wishlistService";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logoutUser } = useAuth();

  // Cart badge count
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const items = await getCart();
        const qty = (items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);
        setCartCount(qty);
        const wl = await getWishlist();
        setWishlistCount((wl || []).length);
      } else {
        const guestItems = getGuestCart();
        const qty = (guestItems || []).reduce((sum, i) => sum + (i.quantity || 1), 0);
        setCartCount(qty);
        setWishlistCount(0);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    refreshCounts();
    window.addEventListener("cartUpdated", refreshCounts);
    window.addEventListener("wishlistUpdated", refreshCounts);
    window.addEventListener("storage", refreshCounts);
    return () => {
      window.removeEventListener("cartUpdated", refreshCounts);
      window.removeEventListener("wishlistUpdated", refreshCounts);
      window.removeEventListener("storage", refreshCounts);
    };
  }, [isLoggedIn]);

  const navLinks = [
    { label: "Nike", to: "/nike" },
    { label: "Adidas", to: "/adidas" },
    { label: "Puma", to: "/puma" },
    { label: "Featured", to: "/featured" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full h-20 flex items-center justify-between px-5 sm:px-8 lg:px-16 bg-white border-b border-[#EAEAEA]">
      <Link to="/" className="text-2xl font-bold tracking-[4px] text-[#242321]">
        NOVA
      </Link>

      <div className="hidden md:flex items-center gap-5 lg:gap-10 text-sm lg:text-[16px] font-medium tracking-wide text-[#514D47]">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "underline underline-offset-8" : "hover:underline underline-offset-8 transition"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4 sm:gap-6 text-[#292722]">
        {/* Wishlist */}
        <Link to="/wishlist" className="relative hover:scale-110 transition duration-300" aria-label="Wishlist">
          <Heart size={20} />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 text-[9px] font-bold bg-[#111111] text-white rounded-full flex items-center justify-center leading-none">
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="relative hover:scale-110 transition duration-300" aria-label="Shopping bag">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 text-[9px] font-bold bg-[#111111] text-white rounded-full flex items-center justify-center leading-none">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="hover:scale-110 transition duration-300 flex items-center justify-center cursor-pointer"
            aria-label="Account menu"
          >
            <UserRound size={20} />
          </button>

          <UserDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            isLoggedIn={isLoggedIn}
            onLogout={logoutUser}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden hover:scale-110 transition duration-300 cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu size={22} />
        </button>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={logoutUser}
      />
    </nav>
  );
};

export default Navbar;
