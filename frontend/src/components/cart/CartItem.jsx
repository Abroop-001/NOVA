import { Link } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item || !item.product) return null;

  const { product, size, quantity = 1, _id } = item;
  const productId = product._id || product.id;

  const displayImage =
    (product.images && product.images.length > 0 ? product.images[0] : null) ||
    product.image ||
    "/hero-shoe.png";

  const originalPrice = Number(product.price) || 0;
  const hasDiscount =
    product.discountPrice != null && Number(product.discountPrice) < originalPrice;
  const effectivePrice = hasDiscount
    ? Number(product.discountPrice)
    : originalPrice;
  const lineTotal = effectivePrice * quantity;

  const maxStock = product.stock || 99;
  const isAtMaxStock = quantity >= maxStock;

  return (
    <div className="py-6 sm:py-8 border-b border-[#EAEAEA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 group">
      
      {/* Left side: Image + Product Details */}
      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
        
        {/* Sneaker Thumbnail with #E8E9E6 background */}
        <Link
          to={`/product/${productId}`}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#F5F5F2] shrink-0 p-1.5 sm:p-3 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-102"
        >
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain scale-[1.12] sm:scale-100 mix-blend-multiply drop-shadow-xs"
          />
        </Link>

        {/* Product Details Info */}
        <div className="min-w-0 flex-1">
          {product.brand && (
            <p className="text-[11px] uppercase tracking-[2px] font-semibold text-[#777777] mb-0.5">
              {product.brand}
            </p>
          )}

          <Link
            to={`/product/${productId}`}
            className="text-sm sm:text-base font-bold text-[#171717] hover:text-[#555555] transition block truncate leading-snug"
          >
            {product.name}
          </Link>

          {/* Size and Color Details */}
          <div className="flex items-center gap-3 text-xs text-[#555555] mt-1.5 flex-wrap">
            <span className="font-medium bg-[#F7F7F4] px-2 py-0.5 rounded-sm border border-[#EAEAEA]">
              Size: UK {size}
            </span>
            {item.color && (
              <span className="text-[#777777]">Color: {item.color}</span>
            )}
          </div>

          {/* Stock Alert */}
          {isAtMaxStock && (
            <p className="text-[11px] text-amber-700 mt-1.5 font-medium">
              Maximum available stock reached ({maxStock} pairs)
            </p>
          )}
        </div>
      </div>

      {/* Right side: Quantity Selector + Price + Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-5 sm:gap-8 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t border-[#F2F2F0] sm:border-t-0">
        
        {/* Minimal Quantity Selector */}
        <div className="inline-flex items-center border border-[#E0E0DC] rounded-lg bg-[#F7F7F4] p-1">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => onUpdateQuantity(_id, quantity - 1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[#242321] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </button>

          <span className="w-9 text-center text-xs sm:text-sm font-bold text-[#171717]">
            {quantity}
          </span>

          <button
            type="button"
            disabled={isAtMaxStock}
            onClick={() => onUpdateQuantity(_id, quantity + 1)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-[#242321] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Pricing breakdown */}
        <div className="text-right min-w-[90px]">
          <p className="text-sm sm:text-base font-bold text-[#171717]">
            ₹{lineTotal.toLocaleString("en-IN")}
          </p>
          {hasDiscount && (
            <p className="text-xs text-[#888888] line-through">
              ₹{(originalPrice * quantity).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(_id)}
          className="text-[#888888] hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-[#F7F7F4] cursor-pointer"
          title="Remove item"
          aria-label={`Remove ${product.name} from bag`}
        >
          <Trash2 size={16} />
        </button>
      </div>

    </div>
  );
};

export default CartItem;

