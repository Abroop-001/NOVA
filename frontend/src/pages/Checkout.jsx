import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import useCheckout from "../hooks/useCheckout";
import useRazorpayCheckout from "../hooks/useRazorpayCheckout";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    if (!isLoggedIn) openAuthModal("login");
  }, [isLoggedIn, openAuthModal]);

  const {
    cartItems, cartLoading, addresses, addressLoading, selectedAddressId,
    setSelectedAddressId, contact, setContact, addAddress, subtotal,
    total, discount, itemCount, placing, orderError, setOrderError, placeOrder,
  } = useCheckout();

  const { isProcessing, startPayment } = useRazorpayCheckout({
    contact,
    selectedAddressId,
    setOrderError,
    onSuccess: (order) => navigate(`/order-confirmation/${order._id}`),
  });

  const handlePlaceOrder = async () => {
    setOrderError(null);
    if (!contact.email.trim() || !/\S+@\S+\.\S+/.test(contact.email.trim())) {
      return setOrderError("Please enter a valid email address");
    }
    if (!contact.phone.trim() || !/^\d{10}$/.test(contact.phone.trim())) {
      return setOrderError("Please enter a valid 10-digit phone number");
    }
    if (!selectedAddressId) {
      return setOrderError("Please select a delivery address");
    }

    if (paymentMethod === "RAZORPAY") {
      await startPayment();
    } else {
      const order = await placeOrder();
      if (order) navigate(`/order-confirmation/${order._id}`);
    }
  };

  if (!isLoggedIn) return null;

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[#F0F0F0] rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 h-80 bg-[#F5F5F5] rounded-xl" />
            <div className="lg:col-span-5 h-80 bg-[#F5F5F5] rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-5">
            <ShoppingBag size={28} className="text-[#171717]" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide text-[#171717] mb-2">Your bag is empty</h2>
          <p className="text-sm text-[#777777] mb-6">Add items before proceeding to checkout.</p>
          <Link to="/home" className="px-6 py-3 bg-[#171717] text-white text-xs font-semibold uppercase rounded-lg hover:bg-black transition">
            Explore Collection
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between pb-8 border-b border-[#EAEAEA] mb-8 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] uppercase">Checkout</h1>
            <p className="text-xs text-[#777777] mt-1.5 uppercase tracking-wider font-medium">
              {itemCount} {itemCount === 1 ? "item" : "items"} · ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
          <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-semibold text-[#171717] hover:text-[#555555] uppercase tracking-wider transition underline underline-offset-4">
            <ArrowLeft size={14} /> Back to Bag
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <CheckoutForm
              contact={contact} setContact={setContact} addresses={addresses}
              addressLoading={addressLoading} selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId} onAddAddress={addAddress}
              paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
              placing={placing || isProcessing} orderError={orderError}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
          <div className="lg:col-span-5">
            <OrderSummary items={cartItems} subtotal={subtotal} discount={discount} total={total} itemCount={itemCount} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
