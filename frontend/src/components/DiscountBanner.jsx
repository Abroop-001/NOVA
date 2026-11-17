import { Link } from "react-router-dom";

const DiscountBanner = () => {
return ( <section className="relative w-full"> <div className="relative h-110 md:h-95 overflow-hidden">

```
    {/* Banner Image */}
    <img
      src="/discount-shoe.png"
      alt="Puma sneakers"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-linear-to-r from-[#F7F7F4]/95 via-[#F7F7F4]/70 to-transparent"></div>

    {/* Text Content */}
    <div className="relative z-10 w-[85%] sm:w-3/4 md:w-1/2 h-full flex flex-col justify-center px-6 sm:px-8 lg:px-12">

      <p className="text-xs sm:text-sm uppercase tracking-[3px] text-[#555555] mb-3 sm:mb-4">
        Limited Time Offer
      </p>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] leading-tight">
        50% OFF
        <br />
        All Puma Shoes
      </h2>

      <p className="text-sm sm:text-base text-[#555555] mt-4 sm:mt-5 leading-7 max-w-md">
        Step up your style with Puma. Grab your favourite sneakers at half
        the price before this exclusive offer ends.
      </p>

      <Link
        to="/puma"
        className="w-fit mt-5 sm:mt-7 bg-[#171717] text-white px-6 sm:px-8 py-3 text-sm hover:bg-[#333333] transition duration-300"
      >
        Shop Puma →
      </Link>

    </div>
  </div>
</section>

);
};

export default DiscountBanner;
