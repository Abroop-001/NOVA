import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
return ( <footer className="bg-[#F7F7F4] px-6 sm:px-10 lg:px-16 pt-16 border-t border-[#EAEAEA]">


  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">

    {/* Brand */}
    <div>
      <h2 className="text-2xl font-bold tracking-[5px] text-[#171717]">
        NOVA
      </h2>

      <p className="text-sm text-[#555555] leading-7 mt-5 max-w-xs">
        Step into your style. Discover premium sneakers from the world's
        leading footwear brands.
      </p>

      {/* Social Icons */}
      <div className="flex items-center gap-5 mt-6 text-[#292722]">
        <a href="#" aria-label="Instagram" className="hover:text-gray-500 transition">
          <FaInstagram size={19} />
        </a>

        <a href="#" aria-label="Facebook" className="hover:text-gray-500 transition">
          <FaFacebookF size={19} />
        </a>

        <a href="#" aria-label="Twitter" className="hover:text-gray-500 transition">
          <FaXTwitter size={19} />
        </a>
      </div>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-base font-semibold text-[#171717] mb-5">
        Quick Links
      </h3>

      <div className="flex flex-col gap-4 text-sm text-[#555555]">
        <Link to="/" className="hover:text-black transition">Home</Link>
        <Link to="/featured" className="hover:text-black transition">Featured</Link>
        <Link to="/login" className="hover:text-black transition">My Account</Link>
        <Link to="/cart" className="hover:text-black transition">Shopping Cart</Link>
      </div>
    </div>

    {/* Shop by Brand */}
    <div>
      <h3 className="text-base font-semibold text-[#171717] mb-5">
        Shop By Brand
      </h3>

      <div className="flex flex-col gap-4 text-sm text-[#555555]">
        <Link to="/nike" className="hover:text-black transition">Nike</Link>
        <Link to="/adidas" className="hover:text-black transition">Adidas</Link>
        <Link to="/puma" className="hover:text-black transition">Puma</Link>
      </div>
    </div>

    {/* Customer Support */}
    <div>
      <h3 className="text-base font-semibold text-[#171717] mb-5">
        Customer Support
      </h3>

      <div className="flex flex-col gap-4 text-sm text-[#555555]">
        <a href="#" className="hover:text-black transition">Contact Us</a>
        <a href="#" className="hover:text-black transition">Shipping Information</a>
        <a href="#" className="hover:text-black transition">Returns & Refunds</a>
        <a href="#" className="hover:text-black transition">Privacy Policy</a>
      </div>
    </div>

  </div>

  {/* Bottom Footer */}
  <div className="border-t border-[#E0E0DC] py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-[#555555]">
    <p>© 2026 NOVA. All rights reserved.</p>
    <p>Designed for sneaker lovers.</p>
  </div>

</footer>

);
};

export default Footer;
