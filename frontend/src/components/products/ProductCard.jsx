import { useState, useCallback } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart } from "../../services/cartService";
import SizePickerPopup from "./SizePickerPopup";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const productId = product._id || product.id;
  const displayImage =
    (product.images?.length > 0 ? product.images[0] : null) ||
    product.image ||
    "/hero-shoe.png";
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const [showSizePicker, setShowSizePicker] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleCartClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasSizes) return;
    setShowSizePicker((prev) => !prev);
  }, [hasSizes]);

  const handleSizeSelect = useCallback(async (size) => {
    setShowSizePicker(false);
    setStatus("loading");
    try {
      await addToCart(product, size, 1);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1800);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [product]);

  const cartIcon =
    status === "loading" ? (
      <Loader2 size={19} className="animate-spin" />
    ) : status === "success" ? (
      <Check size={19} className="text-green-400" />
    ) : (
      <ShoppingCart size={19} />
    );

  return (
    <div className="group flex flex-col justify-between">
      {/* Product Image */}
      <Link
        to={`/product/${productId}`}
        className="relative h-64 sm:h-72 bg-[#F5F5F2] rounded-xl overflow-hidden flex items-center justify-center p-4 block"
      >
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 bg-[#171717] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Sale
          </span>
        )}
        {(product.brand || product.category) && (
          <span className="absolute bottom-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wider text-[#777777] bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-xs">
            {product.brand || product.category}
          </span>
        )}
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain scale-[1.15] mix-blend-multiply group-hover:scale-[1.22] transition duration-500"
        />
      </Link>

      {/* Product Details */}
      <div className="flex items-start justify-between mt-4 gap-2">
        <div className="min-w-0">
          <Link to={`/product/${productId}`} className="block">
            <h3 className="text-base sm:text-lg font-semibold text-[#171717] truncate hover:text-[#555555] transition">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2 mt-1">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-[#171717]">
                  ₹{Number(product.discountPrice).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-[#888888] line-through">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base text-[#555555]">
                ₹{product.price ? Number(product.price).toLocaleString("en-IN") : "0"}
              </span>
            )}
          </div>
          {hasSizes && (
            <p className="text-[11px] text-[#888888] mt-1">
              Sizes: UK {product.sizes.join(", ")}
            </p>
          )}
        </div>

        {/* Add to Cart – relative wrapper for popup */}
        <div className="relative shrink-0">
          {showSizePicker && (
            <SizePickerPopup
              product={product}
              onSelect={handleSizeSelect}
              onClose={() => setShowSizePicker(false)}
            />
          )}
          <button
            type="button"
            onClick={handleCartClick}
            disabled={!hasSizes || status === "loading"}
            aria-label={`Add ${product.name} to cart`}
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#F5F5F2] hover:bg-[#222222] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition duration-300 cursor-pointer"
          >
            {cartIcon}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
