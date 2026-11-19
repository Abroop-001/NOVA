
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

const PUMA_CONFIG = {
  brand: "Puma",
  heading: "PUMA COLLECTION",
  subtitle:
    "Where sport meets street style. Explore iconic Puma silhouettes, innovative comfort, and bold designs crafted for everyday performance.",
 bannerImage: "/pumabanner.png",
  mobileBannerImage: "/pumabanner1.png",
  tag: "Official Puma Showcase",
};

const Puma = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
  } = useProducts({ brand: PUMA_CONFIG.brand });

  return (
    <div className="max-w-350 mx-auto bg-white min-h-screen flex flex-col">
      <Navbar />

      <CollectionBanner
        heading={PUMA_CONFIG.heading}
        subtitle={PUMA_CONFIG.subtitle}
        bannerImage={PUMA_CONFIG.bannerImage}
        tag={PUMA_CONFIG.tag}
      />

      <section className="bg-white border-b border-[#EAEAEA] sticky top-20 z-30 shadow-xs">
        <div className="px-4 sm:px-8 lg:px-16 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Puma sneakers..."
          />

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

        <ProductFilters
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          pricePresetIndex={pricePresetIndex}
          onSelectPricePreset={handlePricePreset}
          onReset={resetFilters}
          isFilterActive={isFilterActive}
          mobileOpen={showMobileFilters}
          onCloseMobile={() => setShowMobileFilters(false)}
          title="Filter Puma Collection"
        />
      </section>

      <section className=" px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16 flex-1">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-[#555555] mb-1 sm:mb-2 font-medium">
              Curated Footwear
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#171717]">
              Puma Sneakers
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

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={refetch}
          onResetFilters={resetFilters}
          emptyMessage="No Puma sneakers found matching your criteria."
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

      <Footer />
    </div>
  );
};

export default Puma;
