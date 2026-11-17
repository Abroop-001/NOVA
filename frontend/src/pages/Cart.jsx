import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartHeader from "../components/cart/CartHeader";
import CartItemList from "../components/cart/CartItemList";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import useCart from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, RefreshCw } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { openAuthModal, isLoggedIn } = useAuth();
  const {
    items,
    loading,
    error,
    itemCount,
    subtotal,
    discountTotal,
    deliveryFee,
    total,
    updateQuantity,
    removeItem,
    refreshCart,
  } = useCart();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      // Open auth modal instead of redirecting; after login, user can proceed
      openAuthModal("login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          /* Luxury Loading Skeleton */
          <div className="animate-pulse">
            <div className="pb-8 border-b border-[#EAEAEA] mb-8">
              <div className="h-9 w-64 bg-[#F0F0F0] rounded mb-3" />
              <div className="h-4 w-40 bg-[#F5F5F5] rounded" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-8 space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-6 py-6 border-b border-[#EAEAEA]">
                    <div className="w-28 h-28 bg-[#E8E9E6] rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-3 w-16 bg-[#F0F0F0] rounded" />
                      <div className="h-5 w-48 bg-[#F0F0F0] rounded" />
                      <div className="h-4 w-20 bg-[#F5F5F5] rounded" />
                      <div className="h-8 w-28 bg-[#F5F5F5] rounded mt-4" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-4">
                <div className="h-80 bg-[#FBFBFA] border border-[#EAEAEA] rounded-2xl p-6" />
              </div>
            </div>
          </div>
        ) : error && items.length === 0 ? (
          /* Error State */
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-wide text-[#171717] mb-2">
              Unable to Load Bag
            </h2>
            <p className="text-sm text-[#777777] mb-6 font-light">{error}</p>
            <button
              onClick={refreshCart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition cursor-pointer"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Empty Bag State */
          <EmptyCart />
        ) : (
          /* Populated Cart Layout */
          <div>
            <CartHeader itemCount={itemCount} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column (65% on desktop): Product List */}
              <div className="lg:col-span-8">
                <CartItemList
                  items={items}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              </div>

              {/* Right Column (35% on desktop): Order Summary */}
              <div className="lg:col-span-4">
                <CartSummary
                  subtotal={subtotal}
                  discountTotal={discountTotal}
                  deliveryFee={deliveryFee}
                  total={total}
                  itemCount={itemCount}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;

