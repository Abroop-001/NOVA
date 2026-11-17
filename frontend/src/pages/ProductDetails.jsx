import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Check, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/products/ProductCard";
import ProductGallery from "../components/productDetails/ProductGallery";
import ProductInfo from "../components/productDetails/ProductInfo";
import SizeSelector from "../components/productDetails/SizeSelector";
import QuantitySelector from "../components/productDetails/QuantitySelector";
import ProductActions from "../components/productDetails/ProductActions";
import ProductAccordion from "../components/productDetails/ProductAccordion";
import ProductReviews from "../components/productDetails/ProductReviews";
import { getProductById, getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import api from "../api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product and related items
  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedSize(null);
      setQuantity(1);
      setSizeError(false);

      const data = await getProductById(id);

      if (data && data.success && data.product) {
        const prod = data.product;
        setProduct(prod);

        const initialImg =
          (prod.images && prod.images.length > 0 ? prod.images[0] : null) ||
          prod.image ||
          "/hero-shoe.png";
        setActiveImage(initialImg);

        // Fetch related products from same brand
        try {
          const relData = await getProducts({ brand: prod.brand, limit: 5 });
          if (relData && relData.products) {
            setRelatedProducts(
              relData.products
                .filter((p) => (p._id || p.id) !== (prod._id || prod.id))
                .slice(0, 4)
            );
          }
        } catch (relErr) {
          console.error("Error loading related products:", relErr);
        }

        // Check if item is in user's wishlist
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const wishRes = await api.get("/wishlist");
            if (wishRes.data?.wishlist?.products) {
              const inList = wishRes.data.wishlist.products.some(
                (p) => (typeof p === "string" ? p : p._id) === prod._id
              );
              setIsInWishlist(inList);
            }
          } catch {
            // Wishlist empty or unauthenticated
          }
        }
      } else {
        setError("Product not found.");
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load product details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProductData();
  }, [fetchProductData]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    try {
      setCartLoading(true);
      await addToCart(
        product,
        selectedSize,
        quantity,
        product.colors?.[0] || ""
      );

      setCartSuccess(true);
      setNotification({
        type: "success",
        message: `${product.name} (UK ${selectedSize}) added to your bag.`,
      });
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message:
          err.response?.data?.message || err.message || "Failed to add to cart.",
      });
    } finally {
      setCartLoading(false);
    }
  };

  // Handle Wishlist Toggle
  const handleToggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotification({
        type: "info",
        message: "Please log in to save items to your wishlist.",
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      setWishlistLoading(true);
      if (isInWishlist) {
        await api.delete(`/wishlist/remove/${product._id}`);
        setIsInWishlist(false);
        setNotification({ type: "info", message: "Removed from your wishlist." });
      } else {
        await api.post("/wishlist/add", { productId: product._id });
        setIsInWishlist(true);
        setNotification({ type: "success", message: "Saved to your wishlist." });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err.response?.data?.message || "Wishlist update failed.",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-350 mx-auto bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="px-5 sm:px-8 lg:px-16 py-12 flex-1">
          <div className="h-4 bg-[#E0E0DC] rounded-sm w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="h-100 sm:h-130 rounded-2xl bg-[#F5F5F2] animate-pulse" />
            </div>
            <div className="lg:col-span-5 space-y-5">
              <div className="h-4 bg-[#E0E0DC] rounded-sm w-24 animate-pulse" />
              <div className="h-8 bg-[#E0E0DC] rounded-sm w-3/4 animate-pulse" />
              <div className="h-6 bg-[#E0E0DC] rounded-sm w-32 animate-pulse" />
              <div className="h-20 bg-[#F5F5F2] rounded-xl animate-pulse" />
              <div className="h-12 bg-[#F5F5F2] rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-350 mx-auto bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="px-5 sm:px-8 lg:px-16 py-24 text-center max-w-md mx-auto flex-1 flex flex-col justify-center items-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F5F2] flex items-center justify-center text-[#555] mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-2xl font-bold text-[#171717] mb-2">Product Not Available</h2>
          <p className="text-sm text-[#666666] mb-6">
            {error || "The sneaker you are looking for is no longer available or does not exist."}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={fetchProductData}
              className="px-6 py-2.5 text-sm bg-[#252421] text-white rounded-lg hover:bg-[#403D38] transition cursor-pointer"
            >
              Retry
            </button>
            <Link
              to="/home"
              className="px-6 py-2.5 text-sm border border-[#E0E0DC] text-[#242321] rounded-lg hover:bg-[#F7F7F4] transition"
            >
              Explore Collection
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-350 mx-auto bg-white min-h-screen flex flex-col">
      <Navbar />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-24 right-5 sm:right-10 z-50 animate-bounce duration-300">
          <div className="bg-[#171717] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm border border-[#333]">
            {notification.type === "success" && <Check size={18} className="text-emerald-400" />}
            {notification.type === "error" && <AlertCircle size={18} className="text-rose-400" />}
            {notification.type === "info" && <Sparkles size={18} className="text-amber-400" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="px-5 sm:px-8 lg:px-16 pt-6 pb-2 text-xs text-[#777777]">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link to="/home" className="hover:text-[#171717] transition">
              Home
            </Link>
          </li>
          <ChevronRight size={12} className="text-[#AAA]" />
          <li>
            <Link
              to={`/${product.brand.toLowerCase()}`}
              className="hover:text-[#171717] transition font-medium"
            >
              {product.brand}
            </Link>
          </li>
          <ChevronRight size={12} className="text-[#AAA]" />
          <li className="text-[#171717] font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Section */}
      <main className="px-5 sm:px-8 lg:px-16 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left: Gallery */}
          <ProductGallery
            images={product.images}
            activeImage={activeImage}
            onSelectImage={setActiveImage}
            productName={product.name}
            hasDiscount={hasDiscount}
            discountPercent={discountPercent}
            isOutOfStock={isOutOfStock}
            stock={product.stock}
          />

          {/* Right: Information & Selectors */}
          <section className="lg:col-span-5 flex flex-col justify-start">
            <ProductInfo
              brand={product.brand}
              name={product.name}
              category={product.category}
              price={product.price}
              discountPrice={product.discountPrice}
              hasDiscount={hasDiscount}
              isOutOfStock={isOutOfStock}
              stock={product.stock}
            />

            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={(sz) => {
                setSelectedSize(sz);
                setSizeError(false);
              }}
              hasError={sizeError}
            />

            <QuantitySelector
              quantity={quantity}
              stock={product.stock}
              isOutOfStock={isOutOfStock}
              onIncrease={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />

            <ProductActions
              isOutOfStock={isOutOfStock}
              cartLoading={cartLoading}
              cartSuccess={cartSuccess}
              onAddToCart={handleAddToCart}
              isInWishlist={isInWishlist}
              wishlistLoading={wishlistLoading}
              onToggleWishlist={handleToggleWishlist}
            />
          </section>
        </div>

        {/* Product Details Information Cards */}
        <ProductAccordion product={product} />

        {/* Customer Reviews & Verified Submission */}
        <ProductReviews productId={product._id || product.id} />

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-[#EAEAEA]">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-[#777777] font-semibold mb-2">
                More From {product.brand}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#171717]">
                You May Also Like
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd._id || relProd.id} product={relProd} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
