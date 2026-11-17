import { Search, X } from "lucide-react";

const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search sneakers...",
  onClear,
}) => {
  return (
    <div className="relative flex-1 max-w-md w-full">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#F7F7F4] border border-[#E0E0DC] rounded-lg focus:outline-hidden focus:border-[#242321] text-[#242321] placeholder-[#888888] transition"
      />
      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange && onChange(""))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#242321] transition"
          aria-label="Clear search query"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

