const ProductInfo = ({
  brand = "",
  name = "",
  category = "",
  price = 0,
  discountPrice = null,
  hasDiscount = false,
  isOutOfStock = false,
  stock = 0,
}) => {
  return (
    <div>
      {/* Brand & Category Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-xs uppercase tracking-[3px] font-bold text-[#666666]">
          {brand}
        </span>
        {category && (
          <span className="text-[11px] uppercase tracking-wider font-medium text-[#777777] bg-[#F7F7F4] border border-[#EAEAEA] px-2.5 py-0.5 rounded-full">
            {category}
          </span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717] leading-tight mb-4">
        {name}
      </h1>

      {/* Price Row */}
      <div className="flex items-baseline gap-3 mb-4">
        {hasDiscount ? (
          <>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
              ₹{Number(discountPrice).toLocaleString("en-IN")}
            </span>
            <span className="text-base sm:text-lg text-[#888888] line-through font-normal">
              ₹{Number(price).toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#171717] text-white">
              Save ₹{(Number(price) - Number(discountPrice)).toLocaleString("en-IN")}
            </span>
          </>
        ) : (
          <span className="text-2xl sm:text-3xl font-bold text-[#171717]">
            ₹{Number(price).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Stock Availability */}
      <div className="flex items-center gap-2 mb-6 text-xs font-medium">
        <span
          className={`w-2 h-2 rounded-full ${
            isOutOfStock ? "bg-rose-500" : "bg-emerald-500 animate-pulse"
          }`}
        />
        <span className={isOutOfStock ? "text-rose-600" : "text-emerald-700"}>
          {isOutOfStock
            ? "Sold Out · Check back soon"
            : `In Stock · Ready to dispatch (${stock} pairs available)`}
        </span>
      </div>

      <div className="border-b border-[#EAEAEA] mb-6" />
    </div>
  );
};

export default ProductInfo;

