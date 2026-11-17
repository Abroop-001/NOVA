import CartItem from "./CartItem";
import { ShieldCheck, Truck } from "lucide-react";

const CartItemList = ({ items = [], onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex-1">
      {/* Items List */}
      <div className="border-t border-[#EAEAEA]">
        {items.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Cart Perks / Guarantees */}
      <div className="mt-8 pt-6 border-t border-[#EAEAEA] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#555555]">
        <div className="flex items-center gap-2.5">
          <Truck size={17} className="text-[#171717] shrink-0" />
          <span>Complimentary premium double-boxed delivery</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={17} className="text-[#171717] shrink-0" />
          <span>100% Verified Authentic · 30-Day Returns</span>
        </div>
      </div>
    </div>
  );
};

export default CartItemList;

