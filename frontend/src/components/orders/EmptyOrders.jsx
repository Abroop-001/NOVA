import React from "react";
import { Link } from "react-router-dom";
import { PackageX, ArrowRight } from "lucide-react";

const EmptyOrders = () => {
  return (
    <div className="py-20 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6 text-[#171717]">
        <PackageX className="w-8 h-8 stroke-[1.25]" />
      </div>

      <span className="text-[11px] font-semibold tracking-[0.25em] text-[#777777] uppercase mb-2">
        Order History
      </span>

      <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight text-[#171717] uppercase mb-3">
        No Orders Placed Yet
      </h2>

      <p className="text-sm font-light text-[#777777] max-w-md mx-auto mb-8 leading-relaxed">
        You haven't placed any orders yet. Discover our latest collection of premium and iconic sneakers.
      </p>

      <Link
        to="/home"
        className="inline-flex items-center justify-center gap-2 bg-[#171717] text-white text-xs font-medium tracking-[0.18em] uppercase px-8 py-3.5 hover:bg-black transition-colors rounded-xl"
      >
        Continue Shopping
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default EmptyOrders;

