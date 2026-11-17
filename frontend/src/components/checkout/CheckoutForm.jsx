import { AlertCircle } from "lucide-react";
import ContactSection from "./ContactSection";
import AddressSection from "./AddressSection";
import PaymentSection from "./PaymentSection";

const CheckoutForm = ({
  contact,
  setContact,
  addresses,
  addressLoading,
  selectedAddressId,
  setSelectedAddressId,
  onAddAddress,
  paymentMethod,
  setPaymentMethod,
  placing,
  orderError,
  onPlaceOrder,
}) => {
  return (
    <div className="space-y-8">
      <ContactSection contact={contact} setContact={setContact} />

      <div className="border-t border-[#EAEAEA]" />

      <AddressSection
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        onAddAddress={onAddAddress}
        loading={addressLoading}
      />

      <div className="border-t border-[#EAEAEA]" />

      <PaymentSection
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      <div className="border-t border-[#EAEAEA]" />

      {orderError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-lg bg-red-50 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      <button
        type="button"
        disabled={placing}
        onClick={onPlaceOrder}
        className="w-full py-4 bg-[#171717] hover:bg-black active:scale-[0.99] disabled:bg-[#999999] disabled:cursor-not-allowed text-white text-sm font-bold tracking-[0.2em] uppercase rounded-xl transition duration-200 cursor-pointer"
      >
        {placing
          ? paymentMethod === "RAZORPAY"
            ? "Processing Payment…"
            : "Placing Order…"
          : paymentMethod === "RAZORPAY"
          ? "Proceed to Pay"
          : "Place Order"}
      </button>

      <p className="text-center text-[11px] text-[#999999]">
        By placing this order, you agree to NOVA's terms and conditions.
      </p>
    </div>
  );
};

export default CheckoutForm;
