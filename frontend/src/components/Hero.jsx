import { Link } from "react-router-dom";

const Hero = () => {
return ( <section className="relative w-full h-120 sm:h-135 lg:h-150 overflow-hidden">

  {/* Hero Image */}
  <img
    src="/hero-shoe.png"
    alt="Featured sneaker"
    className="absolute inset-0 w-full h-full object-cover object-[65%_center] sm:object-center"
  />

  {/* Hero Content */}
  <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-8 lg:px-16 max-w-162.5">

    <p className="text-xs sm:text-sm tracking-[2px] sm:tracking-[3px] uppercase text-[#514D47] mb-3 sm:mb-4">
      Discover Your Style
    </p>

    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-[#242321]">
      Step Into Your Style.
    </h1>

    <p className="text-sm sm:text-base text-[#6B665F] mt-4 sm:mt-5 leading-6 sm:leading-7 max-w-md">
      Explore iconic sneakers from the world's leading footwear brands.
      Find your perfect pair and make every step count.
    </p>

    <Link
      to="/featured"
      className="mt-6 sm:mt-7 w-fit bg-[#252421] text-white px-6 sm:px-8 py-3 text-sm hover:bg-[#403D38] transition duration-300"
    >
      Explore Collection →
    </Link>

  </div>
</section>

);
};

export default Hero;
