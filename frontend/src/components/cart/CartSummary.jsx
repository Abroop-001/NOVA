import { ArrowRight, Lock, ShieldCheck } from "lucide-react";

const CartSummary = ({
  subtotal = 0,
  discountTotal = 0,
  deliveryFee = 0,
  total = 0,
  itemCount = 0,
  onCheckout,
  loading = false,
}) => {
  return (
    <div className="w-full lg:sticky lg:top-28">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FBFBFA] border border-[#EAEAEA] flex flex-col gap-6">
        
        {/* Header */}
        <div className="border-b border-[#EAEAEA] pb-4">
          <h2 className="text-base sm:text-lg font-bold tracking-wider text-[#171717] uppercase">
            Order Summary
          </h2>
          <p className="text-xs text-[#777777] mt-1">
            Prices inclusive of all applicable taxes
          </p>
        </div>

        {/* Calculation Rows */}
        <div className="flex flex-col gap-3.5 text-sm">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-[#555555]">
            <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
            <span className="font-semibold text-[#171717]">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Discount if applicable */}
          {discountTotal > 0 && (
            <div className="flex items-center justify-between text-emerald-700 font-medium">
              <span>Savings / Discount</span>
              <span>-₹{discountTotal.toLocaleString("en-IN")}</span>
            </div>
          )}

          {/* Delivery Charges */}
          <div className="flex items-center justify-between text-[#555555]">
            <span>Estimated Delivery</span>
            <span className="text-emerald-700 font-semibold uppercase text-xs tracking-wider">
              {deliveryFee === 0 ? "Complimentary" : `₹${deliveryFee}`}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-[#EAEAEA] pt-3.5 mt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-[#171717]">Total</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#171717]">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[11px] text-[#777777] mt-1">
              Double-boxed shipping included
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          type="button"
          disabled={loading || itemCount === 0}
          onClick={onCheckout}
          className="w-full py-4 px-6 bg-[#171717] hover:bg-[#333333] active:scale-[0.99] disabled:bg-[#999999] disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition duration-200 flex items-center justify-center gap-3 shadow-sm cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={16} />
        </button>

        {/* Security Reassurance */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#777777] pt-1">
          <Lock size={14} className="text-[#555555]" />
          <span>Encrypted 256-bit SSL Checkout</span>
        </div>

      </div>
    </div>
  );
};

export default CartSummary;

