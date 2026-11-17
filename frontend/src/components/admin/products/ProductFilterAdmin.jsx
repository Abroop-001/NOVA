import React from "react";
import { Search, Plus } from "lucide-react";

const BRANDS = ["All", "Nike", "Adidas", "Puma"];

const ProductFilterAdmin = ({
  search,
  setSearch,
  selectedBrand,
  setSelectedBrand,
  onAddNew,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
          />
        </div>

        {/* Brand Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setSelectedBrand(brand === "All" ? "" : brand)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
                (brand === "All" && !selectedBrand) || selectedBrand === brand
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Add New Product Button */}
      <button
        type="button"
        onClick={onAddNew}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer shrink-0"
      >
        <Plus size={16} />
        Add Product
      </button>
    </div>
  );
};

export default ProductFilterAdmin;

