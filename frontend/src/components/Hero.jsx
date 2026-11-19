import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full h-[320px] sm:h-[420px] lg:h-[680px] overflow-hidden">

      {/* Responsive Hero Images */}
      <picture>
        <source
          media="(max-width: 639px)"
          srcSet="/hero-banner1.png"
        />
        <img
          src="/hero-banner.png"
          alt="NOVA premium sneaker collection"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>

      {/* Explore Collection Button */}
     <div className="absolute bottom-[5%] right-[5%] sm:bottom-[4%] sm:right-[6%] z-10">
 <Link
  to="/featured"
 className="group inline-flex items-center gap-2
bg-white text-black
px-4 py-1 sm:px-6 sm:py-2
text-[10px] sm:text-xs
tracking-[1.5px] sm:tracking-[2px]
font-semibold
shadow-md
hover:bg-black hover:text-white
transition-all duration-300">
  EXPLORE COLLECTION
  <span className="text-sm sm:text-lg transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</Link>
</div>

    </section>
  );
};

export default Hero;