import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * Small popup that lets the user pick a shoe size before adding to cart.
 * Props:
 *   product  – full product object
 *   onSelect – callback(size) when a size is chosen
 *   onClose  – callback to close without selecting
 *   anchor   – { top, left, width } positioning hint (optional)
 */
const SizePickerPopup = ({ product, onSelect, onClose }) => {
  const ref = useRef(null);

  // Close on outside click / Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleOutside);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [onClose]);

  const sizes = product?.sizes || [];

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-white rounded-xl border border-[#E5E7EB] shadow-lg p-3 animate-in fade-in zoom-in-95 duration-150"
      role="dialog"
      aria-label="Select size"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#111111] uppercase tracking-wider">
          Select Size (UK)
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center rounded-full text-[#6B7280] hover:text-[#111111] hover:bg-gray-100 transition cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>

      {sizes.length === 0 ? (
        <p className="text-xs text-[#888888] text-center py-2">No sizes available</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              className="w-10 h-9 text-xs font-semibold rounded-lg border border-[#E5E7EB] text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition cursor-pointer"
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizePickerPopup;
