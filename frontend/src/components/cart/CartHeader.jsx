import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CartHeader = ({ itemCount = 0 }) => {
  return (
    <div className="pb-8 sm:pb-10 border-b border-[#EAEAEA] mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
          YOUR SHOPPING BAG
        </h1>
        <p className="text-xs sm:text-sm text-[#777777] mt-1.5 uppercase tracking-wider font-medium">
          {itemCount} {itemCount === 1 ? "item" : "items"} currently in your bag
        </p>
      </div>

      <Link
        to="/home"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#171717] hover:text-[#555555] uppercase tracking-wider transition underline underline-offset-4"
      >
        <ArrowLeft size={14} />
        Continue Shopping
      </Link>
    </div>
  );
};

export default CartHeader;

