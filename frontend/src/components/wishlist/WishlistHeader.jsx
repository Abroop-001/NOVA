import React from "react";

const WishlistHeader = ({ count = 0 }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EAEAEA] mb-8 sm:mb-12">
      <div>
        <span className="text-[11px] font-semibold tracking-[0.25em] text-[#777777] uppercase">
          Favorites & Saved
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] uppercase mt-0.5">
          My Wishlist
        </h1>
        <p className="text-xs text-[#777777] mt-1 font-light">
          Your curated selection of saved footwear silhouettes.
        </p>
      </div>

      <div className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
        {count} {count === 1 ? "Item Saved" : "Items Saved"}
      </div>
    </div>
  );
};

export default WishlistHeader;

