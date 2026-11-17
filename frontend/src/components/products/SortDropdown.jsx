const SortDropdown = ({ value = "newest", onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-[#777777] font-medium">
        Sort By:
      </span>
      <select
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="px-3 py-2 text-sm font-medium bg-[#F7F7F4] border border-[#E0E0DC] rounded-lg text-[#242321] focus:outline-hidden focus:border-[#242321] cursor-pointer transition"
      >
        <option value="newest">Newest</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortDropdown;

