import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WishlistHeader from "../../components/wishlist/WishlistHeader";
import WishlistGrid from "../../components/wishlist/WishlistGrid";
import WishlistEmpty from "../../components/wishlist/WishlistEmpty";
import { getWishlist, removeFromWishlist } from "../../services/wishlistService";
import { addToCart } from "../../services/cartService";
import { AlertCircle, RefreshCw } from "lucide-react";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const items = await getWishlist();
      setProducts(items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, [loadWishlist]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setProducts((prev) =>
        prev.filter((p) => (p._id || p.id) !== productId)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const handleAddToCart = async (product, size) => {
    await addToCart(product, size, 1, product.colors?.[0] || "");
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <WishlistHeader count={products.length} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-[#F5F5F5] border border-[#EAEAEA]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center max-w-md mx-auto">
            <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
            <p className="text-sm text-[#777777] mb-4">{error}</p>
            <button
              onClick={loadWishlist}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer hover:bg-black"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <WishlistEmpty />
        ) : (
          <WishlistGrid
            products={products}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;

