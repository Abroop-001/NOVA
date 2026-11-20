import { Link } from "react-router-dom";

const DiscountBanner = () => {
  return (
    <Link to="/puma" className="block w-full cursor-pointer">
      <picture>
        <source
          media="(max-width: 639px)"
          srcSet="/discount-mobile.png"
        />
        <img
          src="/discount-desktop.png"
          alt="50% OFF on all Puma products"
          className="block w-full h-auto"
        />
      </picture>
    </Link>
  );
};

export default DiscountBanner;