import { Banknote, CreditCard, Check } from "lucide-react";

const PaymentSection = ({ paymentMethod = "COD", setPaymentMethod }) => {
  return (
    <section>
      <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#171717] mb-5">
        Payment Method
      </h2>

      <div className="space-y-3">
        {/* Cash on Delivery option */}
        <div
          onClick={() => setPaymentMethod && setPaymentMethod("COD")}
          className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition ${
            paymentMethod === "COD"
              ? "border-[#171717] bg-[#FAFAFA]"
              : "border-[#EAEAEA] hover:border-[#CCCCCC] bg-white"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#F0F0F0] flex items-center justify-center">
              <Banknote size={20} className="text-[#171717]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#171717]">
                Cash on Delivery
              </p>
              <p className="text-xs text-[#777777] mt-0.5">
                Pay in cash when your sneakers arrive
              </p>
            </div>
          </div>
          {paymentMethod === "COD" && (
            <div className="w-6 h-6 rounded-full bg-[#171717] text-white flex items-center justify-center">
              <Check size={14} />
            </div>
          )}
        </div>

        {/* Razorpay Online Payment option */}
        <div
          onClick={() => setPaymentMethod && setPaymentMethod("RAZORPAY")}
          className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition ${
            paymentMethod === "RAZORPAY"
              ? "border-[#171717] bg-[#FAFAFA]"
              : "border-[#EAEAEA] hover:border-[#CCCCCC] bg-white"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#F0F0F0] flex items-center justify-center">
              <CreditCard size={20} className="text-[#171717]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#171717]">
                  Online Payment
                </p>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                  Razorpay
                </span>
              </div>
              <p className="text-xs text-[#777777] mt-0.5">
                UPI, Credit / Debit Cards, NetBanking
              </p>
            </div>
          </div>
          {paymentMethod === "RAZORPAY" && (
            <div className="w-6 h-6 rounded-full bg-[#171717] text-white flex items-center justify-center">
              <Check size={14} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
