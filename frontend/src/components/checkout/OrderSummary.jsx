import { ShieldCheck, Truck } from "lucide-react";
import CheckoutItem from "./CheckoutItem";

const OrderSummary = ({
  items,
  subtotal,
  discount,
  total,
  itemCount,
}) => {
  return (
    <div className="w-full lg:sticky lg:top-28">
      <div className="p-5 sm:p-6 rounded-2xl bg-[#FBFBFA] border border-[#EAEAEA]">
        {/* Header */}
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#171717] pb-4 border-b border-[#EAEAEA]">
          Order Summary
        </h2>

        {/* Items */}
        <div className="max-h-80 overflow-y-auto mt-2">
          {items.map((item) => (
            <CheckoutItem key={item._id} item={item} />
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-[#EAEAEA] flex flex-col gap-2.5 text-sm">
          <div className="flex justify-between text-[#555555]">
            <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
            <span className="font-semibold text-[#171717]">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Discount</span>
              <span>−₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="flex justify-between text-[#555555]">
            <span>Delivery</span>
            <span className="text-emerald-700 font-semibold text-xs tracking-wider uppercase">
              Complimentary
            </span>
          </div>

          <div className="flex justify-between pt-3 border-t border-[#EAEAEA]">
            <span className="text-base font-bold text-[#171717]">Total</span>
            <span className="text-lg sm:text-xl font-extrabold text-[#171717]">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-5 pt-4 border-t border-[#EAEAEA] grid grid-cols-2 gap-3 text-[11px] text-[#777777]">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-[#171717] shrink-0" />
            <span>Premium double-boxed delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#171717] shrink-0" />
            <span>100% Authentic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

