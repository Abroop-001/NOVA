import { optimizeCloudinaryUrl, getCloudinarySrcSet } from "../../utils/imageOptimization";

const ProductGallery = ({
  images = [],
  activeImage = "",
  onSelectImage,
  productName = "Sneaker",
  hasDiscount = false,
  discountPercent = 0,
  isOutOfStock = false,
  stock = 0,
}) => {
  const imageGallery = images && images.length > 0 ? images : [activeImage];

  const optimizedMainImage = optimizeCloudinaryUrl(activeImage, { width: 1000 });
  const mainSrcSet = getCloudinarySrcSet(activeImage, [600, 900, 1200]);

  return (
    <section className="lg:col-span-7 flex flex-col gap-4">
      {/* Main Primary Sneaker Stage */}
      <div className="relative h-80 sm:h-125 lg:h-145 rounded-2xl bg-[#F5F5F2] overflow-hidden flex items-center justify-center p-4 sm:p-8 lg:p-8 group">
        {/* Sale Badge */}
        {hasDiscount && (
          <span className="absolute top-4 left-4 z-10 bg-[#171717] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Low Stock Badge */}
        {!isOutOfStock && stock <= 5 && stock > 0 && (
          <span className="absolute top-4 right-4 z-10 bg-[#E07A5F] text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Only {stock} Left
          </span>
        )}

        {/* Main Image */}
        <img
          src={optimizedMainImage}
          srcSet={mainSrcSet}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 900px"
          alt={productName}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl transition-all duration-500 scale-[1.24] sm:scale-[1.18] lg:scale-[1.45] group-hover:scale-[1.30] sm:group-hover:scale-[1.24] lg:group-hover:scale-[1.52]"
        />
      </div>

      {/* Thumbnail Row */}
      {imageGallery.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {imageGallery.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectImage && onSelectImage(img)}
              className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-[#F5F5F2] p-2 overflow-hidden transition-all duration-200 cursor-pointer ${
                activeImage === img
                  ? "border-2 border-[#171717] ring-1 ring-[#171717] scale-102"
                  : "border border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <img
                src={optimizeCloudinaryUrl(img, { width: 200 })}
                alt={`${productName} angle ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGallery;

