import React from "react";
import WishlistItem from "./WishlistItem";

const WishlistGrid = ({ products = [], onRemove, onAddToCart }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <WishlistItem
          key={product._id || product.id}
          product={product}
          onRemove={onRemove}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default WishlistGrid;

