import { AlertCircle } from "lucide-react";

const SizeSelector = ({
  sizes = [],
  selectedSize = null,
  onSelectSize,
  hasError = false,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider font-bold text-[#171717]">
          Select Size (UK)
        </span>
        {selectedSize && (
          <span className="text-xs font-semibold text-[#171717]">
            Selected: UK {selectedSize}
          </span>
        )}
      </div>

      {sizes && sizes.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {sizes.map((sz) => {
            const isSelected = selectedSize === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => onSelectSize && onSelectSize(sz)}
                className={`py-3 text-xs sm:text-sm rounded-xl font-medium transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? "bg-[#171717] text-white border-[#171717] shadow-sm scale-102"
                    : "bg-[#F7F7F4] text-[#242321] border-[#E0E0DC] hover:border-[#171717] hover:bg-white"
                }`}
              >
                UK {sz}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-[#777777]">Standard fit (One Size)</p>
      )}

      {/* Validation Warning */}
      {hasError && (
        <p className="text-xs font-medium text-rose-600 mt-2 flex items-center gap-1.5 animate-pulse">
          <AlertCircle size={14} /> Please select an available size before adding to bag.
        </p>
      )}
    </div>
  );
};

export default SizeSelector;

