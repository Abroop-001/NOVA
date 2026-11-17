import { RotateCcw, X, SlidersHorizontal } from "lucide-react";

export const PRICE_PRESETS = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₹5,000", min: "", max: "5000" },
  { label: "₹5,000 - ₹10,000", min: "5000", max: "10000" },
  { label: "Above ₹10,000", min: "10000", max: "" },
];

export const SIZES = [6, 7, 8, 9, 10, 11, 12];

const ProductFilters = ({
  selectedSize = "",
  onSelectSize,
  pricePresetIndex = 0,
  onSelectPricePreset,
  onReset,
  isFilterActive = false,
  mobileOpen = false,
  onCloseMobile,
  title = "Filter Collection",
}) => {
  return (
    <>
      {/* 1. Desktop Filter Bar */}
      <div className="hidden md:flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3 bg-[#FBFBFA] border-t border-[#EAEAEA] px-5 sm:px-8 lg:px-16 text-xs">
        
        {/* Price Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="uppercase tracking-wider text-[#777777] font-semibold mr-1">
            Price:
          </span>
          {PRICE_PRESETS.map((preset, idx) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onSelectPricePreset && onSelectPricePreset(idx, preset)}
              className={`px-3 py-1.5 rounded-full transition font-medium ${
                pricePresetIndex === idx
                  ? "bg-[#252421] text-white"
                  : "bg-[#ECECE8] text-[#514D47] hover:bg-[#DFDFD9]"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Size Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="uppercase tracking-wider text-[#777777] font-semibold mr-1">
            Size (UK):
          </span>
          <button
            type="button"
            onClick={() => onSelectSize && onSelectSize("")}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              !selectedSize
                ? "bg-[#252421] text-white"
                : "bg-[#ECECE8] text-[#514D47] hover:bg-[#DFDFD9]"
            }`}
          >
            All
          </button>
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                onSelectSize &&
                onSelectSize(selectedSize === String(size) ? "" : String(size))
              }
              className={`w-7 h-7 flex items-center justify-center rounded-md transition font-medium ${
                selectedSize === String(size)
                  ? "bg-[#252421] text-white"
                  : "bg-[#ECECE8] text-[#514D47] hover:bg-[#DFDFD9]"
              }`}
            >
              {size}
            </button>
          ))}

          {/* Clear Filters Button */}
          {isFilterActive && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="ml-2 inline-flex items-center gap-1 uppercase tracking-wider text-[#777777] hover:text-[#242321] transition font-medium"
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>

      </div>

      {/* 2. Mobile Filter Drawer / Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#242321]" />
                <h3 className="font-bold text-lg text-[#242321]">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-full text-[#777] hover:text-[#111]"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Price Presets */}
            <div className="mt-5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#777] mb-3">
                Price Range
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {PRICE_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onSelectPricePreset && onSelectPricePreset(idx, preset)}
                    className={`py-2 px-3 text-xs rounded-lg text-left font-medium transition ${
                      pricePresetIndex === idx
                        ? "bg-[#252421] text-white"
                        : "bg-[#F7F7F4] text-[#514D47] border border-[#E0E0DC]"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Size Filter */}
            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#777] mb-3">
                Shoe Size (UK)
              </h4>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectSize && onSelectSize("")}
                  className={`py-2 text-xs rounded-lg font-medium transition ${
                    !selectedSize
                      ? "bg-[#252421] text-white"
                      : "bg-[#F7F7F4] text-[#514D47] border border-[#E0E0DC]"
                  }`}
                >
                  All
                </button>
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      onSelectSize &&
                      onSelectSize(selectedSize === String(size) ? "" : String(size))
                    }
                    className={`py-2 text-xs rounded-lg font-medium transition ${
                      selectedSize === String(size)
                        ? "bg-[#252421] text-white"
                        : "bg-[#F7F7F4] text-[#514D47] border border-[#E0E0DC]"
                    }`}
                  >
                    UK {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-[#EAEAEA] flex items-center gap-3">
              {onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="flex-1 py-3 text-sm font-semibold bg-[#F7F7F4] text-[#242321] rounded-lg border border-[#E0E0DC]"
                >
                  Reset All
                </button>
              )}
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex-1 py-3 text-sm font-semibold bg-[#252421] text-white rounded-lg hover:bg-[#403D38]"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;
