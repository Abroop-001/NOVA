import { useState, useEffect, useMemo, useCallback } from "react";
import { getProducts } from "../services/productService";
import { PRICE_PRESETS } from "../components/products/ProductFilters";

/**
 * Custom hook to manage product fetching, filtering, searching, sorting, and pagination.
 *
 * @param {Object} [initialFilters={}] - Base filters like { brand: "Nike" } or { isFeatured: true }
 * @param {Object} [options={}] - Additional options like { limit: 12 }
 */
export const useProducts = (initialFilters = {}, options = {}) => {
  const limit = options.limit || 12;

  // Memoize initialFilters so inline object literals don't cause infinite re-renders
  const memoizedBaseFilters = useMemo(
    () => initialFilters,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(initialFilters)]
  );

  // Products and status states
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter, search, and sort states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [pricePresetIndex, setPricePresetIndex] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Search debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle price preset selection
  const handlePricePreset = useCallback((index, preset = null) => {
    const targetPreset = preset || PRICE_PRESETS[index] || PRICE_PRESETS[0];
    setPricePresetIndex(index);
    setMinPrice(targetPreset.min);
    setMaxPrice(targetPreset.max);
    setPage(1);
  }, []);

  // Update selected size and reset page
  const handleSelectSize = useCallback((size) => {
    setSelectedSize(size);
    setPage(1);
  }, []);

  // Update sort and reset page
  const handleSortChange = useCallback((newSort) => {
    setSort(newSort);
    setPage(1);
  }, []);

  // Reset all filters to default
  const resetFilters = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedSize("");
    setPricePresetIndex(0);
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  }, []);

  // Check if any filter is actively applied
  const isFilterActive = useMemo(() => {
    return (
      debouncedSearch !== "" ||
      selectedSize !== "" ||
      minPrice !== "" ||
      maxPrice !== "" ||
      sort !== "newest"
    );
  }, [debouncedSearch, selectedSize, minPrice, maxPrice, sort]);

  // Main fetch function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        ...memoizedBaseFilters,
        page,
        limit,
      };

      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedSize) params.size = selectedSize;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;

      const data = await getProducts(params);

      if (data && data.success) {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalProducts || 0);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (err) {
      console.error("Error in useProducts hook:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load products. Please check your connection or try again."
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedBaseFilters, debouncedSearch, selectedSize, minPrice, maxPrice, sort, page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    // Data & state
    products,
    totalProducts,
    totalPages,
    loading,
    error,
    page,
    setPage,

    // Search
    search,
    setSearch,

    // Filters
    selectedSize,
    setSelectedSize: handleSelectSize,
    pricePresetIndex,
    handlePricePreset,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    isFilterActive,

    // Sorting
    sort,
    setSort: handleSortChange,

    // Actions
    resetFilters,
    refetch: fetchProducts,
  };
};

export default useProducts;

