import React from "react";
import { Edit2, Trash2, Tag } from "lucide-react";

const ProductCardAdmin = ({ product, onEdit, onDelete, isDeleting }) => {
  const image =
    (product.images && product.images.length > 0
      ? product.images[0]
      : product.image) || "/hero-shoe.png";

  const originalPrice = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice);
  const hasDiscount =
    product.discountPrice != null && discountPrice < originalPrice;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:border-gray-400 transition-all flex flex-col justify-between">
      {/* Thumbnail Container */}
      <div className="relative aspect-square bg-[#F5F5F2] p-6 flex items-center justify-center">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-contain"
        />

        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
            <Tag size={10} /> Featured
          </span>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-xs">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition"
            title="Edit Product"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onDelete(product._id || product.id)}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            title="Delete Product"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {product.brand}
          </span>
          <h4 className="text-sm font-bold text-gray-900 truncate">
            {product.name}
          </h4>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <span className="text-sm font-bold text-gray-900">
              ₹{(hasDiscount ? discountPrice : originalPrice).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through ml-2">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              product.stock > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCardAdmin;

