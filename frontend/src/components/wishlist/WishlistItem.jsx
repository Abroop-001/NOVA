import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Check } from "lucide-react";

const WishlistItem = ({ product, onRemove, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const prodId = product._id || product.id;
  const image =
    (product.images && product.images.length > 0
      ? product.images[0]
      : product.image) || "/hero-shoe.png";

  const originalPrice = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice);
  const hasDiscount =
    product.discountPrice != null && discountPrice < originalPrice;

  const handleAdd = async () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setAdding(true);
    try {
      await onAddToCart(product, selectedSize || product.sizes?.[0] || 8);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between border border-[#EAEAEA] rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-[#171717] hover:shadow-sm">
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-[#F5F5F2] p-6 flex items-center justify-center overflow-hidden">
        <Link to={`/product/${prodId}`} className="w-full h-full flex items-center justify-center">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button
          type="button"
          onClick={() => onRemove(prodId)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#777777] hover:text-red-600 hover:bg-white shadow-sm transition-colors cursor-pointer"
          title="Remove from Wishlist"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#777777]">
            {product.brand}
          </span>
          <Link to={`/product/${prodId}`}>
            <h3 className="text-sm font-semibold text-[#171717] hover:text-[#555555] transition-colors truncate mt-1">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-[#171717]">
              ₹{(hasDiscount ? discountPrice : originalPrice).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#999999] line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Available Sizes Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#777777] block mb-1.5">
                Select Size (UK)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSize(s);
                      setSizeError(false);
                    }}
                    className={`w-7 h-7 text-xs font-semibold rounded-lg border transition-all ${
                      selectedSize === s
                        ? "border-[#171717] bg-[#171717] text-white"
                        : "border-[#EAEAEA] bg-[#FAF9F6] text-[#171717] hover:border-[#171717]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-[11px] text-red-600 mt-1">
                  Please choose a size first
                </p>
              )}
            </div>
          )}
        </div>

        {/* Add to Bag Button */}
        <button
          type="button"
          disabled={adding}
          onClick={handleAdd}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            added
              ? "bg-emerald-700 text-white"
              : "bg-[#171717] text-white hover:bg-black active:scale-[0.99]"
          }`}
        >
          {added ? (
            <>
              <Check size={14} /> Added to Bag
            </>
          ) : (
            <>
              <ShoppingBag size={14} /> Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;

