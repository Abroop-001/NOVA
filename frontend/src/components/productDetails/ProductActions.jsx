import { ShoppingCart, Heart, ShieldCheck, Truck } from "lucide-react";

const ProductActions = ({
  isOutOfStock = false,
  cartLoading = false,
  cartSuccess = false,
  onAddToCart,
  isInWishlist = false,
  wishlistLoading = false,
  onToggleWishlist,
}) => {
  return (
    <div>
      <div className="flex flex-col gap-3 mb-8">
        {/* Add to Cart Button */}
        <button
          type="button"
          disabled={isOutOfStock || cartLoading}
          onClick={onAddToCart}
          className="w-full py-4 px-8 bg-[#171717] hover:bg-[#333333] active:scale-[0.99] disabled:bg-[#999999] disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition duration-200 flex items-center justify-center gap-3 shadow-sm cursor-pointer"
        >
          <ShoppingCart size={18} />
          <span>
            {isOutOfStock
              ? "Out of Stock"
              : cartLoading
              ? "Adding to Bag..."
              : cartSuccess
              ? "Added to Bag ✓"
              : "Add to Bag"}
          </span>
        </button>

        {/* Add / Remove Wishlist Button */}
        <button
          type="button"
          disabled={wishlistLoading}
          onClick={onToggleWishlist}
          className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm transition duration-200 flex items-center justify-center gap-2.5 border cursor-pointer active:scale-[0.99] ${
            isInWishlist
              ? "bg-[#F7F7F4] border-[#171717] text-[#171717]"
              : "border-[#242321] text-[#242321] hover:bg-[#F7F7F4]"
          }`}
        >
          <Heart
            size={18}
            className={isInWishlist ? "fill-rose-500 text-rose-500" : ""}
          />
          <span>
            {isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
          </span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EAEAEA] text-xs text-[#555555]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#171717] shrink-0" />
          <span>100% Genuine & Verified</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck size={18} className="text-[#171717] shrink-0" />
          <span>Complimentary Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;

