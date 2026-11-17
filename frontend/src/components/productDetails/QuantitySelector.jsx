import { Plus, Minus } from "lucide-react";

const QuantitySelector = ({
  quantity = 1,
  stock = 1,
  isOutOfStock = false,
  onIncrease,
  onDecrease,
}) => {
  return (
    <div className="mb-8">
      <span className="text-xs uppercase tracking-wider font-bold text-[#171717] block mb-3">
        Quantity
      </span>
      <div className="inline-flex items-center border border-[#E0E0DC] rounded-xl bg-[#F7F7F4] p-1">
        <button
          type="button"
          disabled={quantity <= 1 || isOutOfStock}
          onClick={onDecrease}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#242321] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus size={15} />
        </button>
        <span className="w-12 text-center text-sm font-bold text-[#171717]">
          {quantity}
        </span>
        <button
          type="button"
          disabled={quantity >= stock || isOutOfStock}
          onClick={onIncrease}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#242321] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;

