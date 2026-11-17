import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

const EmptyCart = () => {
  return (
    <div className="py-20 md:py-28 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6 text-[#171717]">
        <ShoppingBag className="w-8 h-8 stroke-[1.25]" />
      </div>

      <span className="text-[11px] font-semibold tracking-[0.25em] text-[#777777] uppercase mb-2">
        Shopping Bag
      </span>

      <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-[#171717] uppercase mb-3">
        Your Bag is Empty
      </h2>

      <p className="text-sm font-light text-[#777777] max-w-md mx-auto mb-8 leading-relaxed">
        Your shopping bag currently has no items. Explore our curated portfolio of iconic silhouettes, limited releases, and performance sneakers.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/collections/featured"
          className="inline-flex items-center justify-center gap-2 bg-[#171717] text-white text-xs font-medium tracking-[0.18em] uppercase px-8 py-3.5 hover:bg-black transition-colors"
        >
          Explore Featured
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/home"
          className="inline-flex items-center justify-center gap-2 border border-[#EAEAEA] bg-white text-[#171717] text-xs font-medium tracking-[0.18em] uppercase px-8 py-3.5 hover:bg-[#F9F9F9] transition-colors"
        >
          View All Collections
        </Link>
      </div>

      <div className="mt-16 pt-8 border-t border-[#EAEAEA] max-w-lg w-full grid grid-cols-2 gap-6 text-left">
        <div>
          <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#171717] mb-1">
            Need Guidance?
          </h4>
          <p className="text-xs font-light text-[#777777]">
            Our concierge team is available to assist with sizing and product queries.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#171717] mb-1">
            Complimentary Shipping
          </h4>
          <p className="text-xs font-light text-[#777777]">
            All orders include premium double-boxed courier delivery at zero charge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;

