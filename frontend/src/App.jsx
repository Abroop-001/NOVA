import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import AuthModal from "./components/auth/AuthModal";
import Home from "./pages/Home";
import Nike from "./pages/collections/Nike";
import Adidas from "./pages/collections/Adidas";
import Featured from "./pages/collections/Featured";
import Puma from "./pages/collections/Puma";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyProfile from "./pages/profile/MyProfile";
import MyAddresses from "./pages/addresses/MyAddresses";
import Wishlist from "./pages/wishlist/Wishlist";
import MyOrders from "./pages/orders/MyOrders";

import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminReturns from "./pages/admin/AdminReturns";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => {
  return (
    <>
      <AuthModal />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/nike" element={<Nike />} />
        <Route path="/adidas" element={<Adidas />} />
        <Route path="/puma" element={<Puma />} />
        <Route path="/featured" element={<Featured />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/addresses" element={<MyAddresses />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<MyOrders />} />

        {/* Admin Panel Nested Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="returns" element={<AdminReturns />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
