import React from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";

const WishlistEmpty = () => {
  return (
    <div className="py-20 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-6 text-[#171717]">
        <Heart className="w-8 h-8 stroke-[1.25]" />
      </div>

      <span className="text-[11px] font-semibold tracking-[0.25em] text-[#777777] uppercase mb-2">
        Wishlist
      </span>

      <h2 className="text-2xl sm:text-3xl font-extralight tracking-tight text-[#171717] uppercase mb-3">
        Your Wishlist is Empty
      </h2>

      <p className="text-sm font-light text-[#777777] max-w-md mx-auto mb-8 leading-relaxed">
        Save the sneakers you love by clicking the heart icon on any product. Revisit them here whenever you're ready.
      </p>

      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 bg-[#171717] text-white text-xs font-medium tracking-[0.18em] uppercase px-8 py-3.5 hover:bg-black transition-colors rounded-xl"
      >
        Explore Collection
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default WishlistEmpty;

