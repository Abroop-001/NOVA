import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CollectionBanner from "../../components/products/CollectionBanner";
import SearchBar from "../../components/products/SearchBar";
import ProductFilters from "../../components/products/ProductFilters";
import SortDropdown from "../../components/products/SortDropdown";
import ProductGrid from "../../components/products/ProductGrid";
import useProducts from "../../hooks/useProducts";

const NIKE_CONFIG = {
  brand: "Nike",
  heading: "NIKE COLLECTION",
  subtitle:
    "Engineered for excellence and legendary street culture. Explore iconic Air Max, coveted Dunks, and cutting-edge performance silhouettes built to elevate every stride.",
    bannerImage: "/nike-banner.png",
  mobileBannerImage: "/nike-banner1.png",
  tag: "Official Nike Showcase",
};

const Nike = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Reusable products hook managing API, filters, search, sort, and pagination
  const {
    products,
    totalProducts,
    totalPages,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    selectedSize,
    setSelectedSize,
    pricePresetIndex,
    handlePricePreset,
    sort,
    setSort,
    resetFilters,
    refetch,
    isFilterActive,
  } = useProducts({ brand: NIKE_CONFIG.brand });

  return (
    <div className="max-w-350 mx-auto bg-white min-h-screen flex flex-col">
      {/* 1. Navigation */}
      <Navbar />

     <CollectionBanner
  heading={NIKE_CONFIG.heading}
  subtitle={NIKE_CONFIG.subtitle}
  bannerImage={NIKE_CONFIG.bannerImage}
  mobileBannerImage={NIKE_CONFIG.mobileBannerImage}
  tag={NIKE_CONFIG.tag}
/>

      {/* 3. Filter & Sort Bar */}
      <section className="bg-white border-b border-[#EAEAEA] sticky top-20 z-30 shadow-xs">
        <div className="px-4 sm:px-8 lg:px-16 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Reusable Search Bar */}
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Nike sneakers..."
          />

          {/* Quick Controls: Mobile Filter Button & Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-3.5 py-2 text-sm font-medium bg-[#F7F7F4] border border-[#E0E0DC] rounded-lg text-[#242321] active:bg-[#ECECE8] transition"
            >
              <SlidersHorizontal size={16} />
              Filters
              {isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-[#242321]" />
              )}
            </button>

            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Reusable Product Filters (Desktop Strip + Mobile Drawer) */}
        <ProductFilters
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          pricePresetIndex={pricePresetIndex}
          onSelectPricePreset={handlePricePreset}
          onReset={resetFilters}
          isFilterActive={isFilterActive}
          mobileOpen={showMobileFilters}
          onCloseMobile={() => setShowMobileFilters(false)}
          title="Filter Nike Collection"
        />
      </section>

      {/* 4. Products Grid Section */}
      <section className=" px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16 flex-1">
        {/* Section Heading & Product Count */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-[#555555] mb-1 sm:mb-2 font-medium">
              Curated Footwear
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171717]">
              Nike Sneakers
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-[#555555]">
            {!loading && (
              <span>
                Showing <strong className="text-[#171717]">{products.length}</strong> of{" "}
                <strong className="text-[#171717]">{totalProducts}</strong> shoes
              </span>
            )}
          </div>
        </div>

        {/* Reusable Responsive Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={refetch}
          onResetFilters={resetFilters}
          emptyMessage="No Nike sneakers found matching your criteria."
          pagination={{
            page,
            totalPages,
            onPageChange: (newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 400, behavior: "smooth" });
            },
          }}
        />
      </section>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
};

export default Nike;
