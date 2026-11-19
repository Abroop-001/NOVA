import { Search, RotateCcw, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductGrid = ({
  products = [],
  loading = false,
  error = null,
  onRetry,
  onResetFilters,
  emptyMessage = "No sneakers found matching your criteria.",
  pagination = null, // { page, totalPages, onPageChange }
}) => {
  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse w-full max-w-[340px] sm:max-w-none mx-auto">
            <div className="h-60 sm:h-72 bg-[#F5F5F2] rounded-xl mb-4" />
            <div className="h-4 bg-[#E0E0DC] rounded-sm w-3/4 mb-2" />
            <div className="h-4 bg-[#E0E0DC] rounded-sm w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  // 2. ERROR STATE
  if (error) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#EAEAEA] flex items-center justify-center text-[#555]">
          <X size={26} />
        </div>
        <h3 className="text-lg font-bold text-[#171717] mb-2">
          Unable to load products
        </h3>
        <p className="text-sm text-[#666666] mb-6">
          {error}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-[#252421] text-white px-6 py-2.5 text-sm hover:bg-[#403D38] transition duration-300"
          >
            <RotateCcw size={15} />
            Try Again
          </button>
        )}
      </div>
    );
  }

  // 3. EMPTY STATE
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F5F5F2] flex items-center justify-center text-[#555]">
          <Search size={26} />
        </div>
        <h3 className="text-xl font-bold text-[#171717] mb-2">
          No Products Found
        </h3>
        <p className="text-sm text-[#666666] mb-6">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 bg-[#252421] text-white px-6 py-2.5 text-sm hover:bg-[#403D38] transition duration-300"
          >
            <RotateCcw size={15} />
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  // 4. PRODUCTS GRID
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            priority={idx < 4}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onPageChange(Math.max(pagination.page - 1, 1))}
            className="p-2.5 rounded-lg border border-[#E0E0DC] bg-white text-[#242321] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F7F4] transition"
            aria-label="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          {[...Array(pagination.totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => pagination.onPageChange(pageNum)}
                className={`w-10 h-10 text-sm font-semibold rounded-lg transition ${
                  pagination.page === pageNum
                    ? "bg-[#252421] text-white"
                    : "bg-white text-[#514D47] border border-[#E0E0DC] hover:bg-[#F7F7F4]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => pagination.onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
            className="p-2.5 rounded-lg border border-[#E0E0DC] bg-white text-[#242321] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F7F4] transition"
            aria-label="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

