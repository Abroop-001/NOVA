import { Link } from "react-router-dom";
import ProductCard from "./products/ProductCard";
import useProducts from "../hooks/useProducts";

const FeaturedProducts = () => {
  const { products, loading } = useProducts({ isFeatured: true }, { limit: 4 });

  return (
    <section className="px-4 sm:px-8 lg:px-16 py-10 sm:py-12 lg:py-16">
      {/* Heading */}
      <div className="mb-8 sm:mb-10">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-[#555555] mb-3">
          Handpicked For You
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#171717]">
          Featured Sneakers
        </h2>
        <p className="text-sm sm:text-base text-[#555555] mt-3">
          Discover our most popular sneaker collection.
        </p>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse w-full max-w-[340px] sm:max-w-none mx-auto">
              <div className="h-60 sm:h-72 bg-[#F5F5F2] rounded-xl mb-4" />
              <div className="h-4 bg-[#E0E0DC] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#E0E0DC] rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Products grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((product, idx) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              priority={idx < 4}
            />
          ))}
        </div>
      )}

      {/* Fallback when no featured products */}
      {!loading && products.length === 0 && (
        <p className="text-sm text-[#888888] text-center py-10">
          No featured products available right now.
        </p>
      )}

      {/* View all link */}
      {!loading && products.length > 0 && (
        <div className="text-center mt-8">
          <Link
            to="/featured"
            className="inline-block text-sm font-semibold text-[#171717] underline underline-offset-4 hover:opacity-70 transition"
          >
            View All Featured →
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
