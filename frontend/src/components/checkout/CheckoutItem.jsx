const CheckoutItem = ({ item }) => {
  const product = item.product;
  if (!product) return null;

  const originalPrice = Number(product.price) || 0;
  const discPrice = Number(product.discountPrice);
  const hasDiscount =
    product.discountPrice != null && discPrice < originalPrice;
  const effectivePrice = hasDiscount ? discPrice : originalPrice;
  const lineTotal = effectivePrice * (item.quantity || 1);

  const image = product.images?.[0] || product.image || "/hero-shoe.png";

  return (
    <div className="flex gap-4 py-4 border-b border-[#F0F0F0] last:border-b-0">
      {/* Thumbnail */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#F5F5F2] flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-contain p-1.5"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-wider uppercase text-[#999999]">
            {product.brand}
          </p>
          <p className="text-sm font-semibold text-[#171717] truncate mt-0.5">
            {product.name}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-[#777777]">
            <span>Size: UK {item.size}</span>
            <span>Qty: {item.quantity}</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-[#171717]">
          ₹{lineTotal.toLocaleString("en-IN")}
        </p>
        {hasDiscount && (
          <p className="text-xs text-[#999999] line-through mt-0.5">
            ₹{(originalPrice * (item.quantity || 1)).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutItem;

