import { Sparkles } from "lucide-react";

const CollectionBanner = ({
  heading = "COLLECTION",
  subtitle = "Explore our premium selection of curated footwear.",
  bannerImage = "/nike.png",
  tag = "Curated Collection",
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#F7F7F4] border-b border-[#EAEAEA]">
      <div className="relative min-h-100 sm:min-h-120 lg:min-h-135 flex items-center px-5 sm:px-8 lg:px-16 py-12 lg:py-0">
        
        {/* Background Visual Sneaker Element */}
        {bannerImage && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full lg:w-3/5 h-full pointer-events-none opacity-20 sm:opacity-30 lg:opacity-100 flex items-center justify-end">
            <div className="relative w-full h-80 sm:h-110 lg:h-130 flex items-center justify-center lg:justify-end">
              <div className="absolute w-72 sm:w-96 lg:w-120 h-72 sm:h-96 lg:h-120 rounded-full bg-[#E4E4DE] blur-3xl -z-10" />
              <img
                src={bannerImage}
                alt={heading}
                className="w-full max-w-sm sm:max-w-md lg:max-w-xl h-auto object-contain mix-blend-multiply drop-shadow-2xl scale-105 sm:scale-110 lg:scale-125 transition-transform duration-700 hover:rotate-[-4deg]"
              />
            </div>
          </div>
        )}

        {/* Banner Text Content */}
        <div className="relative z-10 max-w-2xl">
          {tag && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAEAE6] rounded-full mb-4">
              <Sparkles size={14} className="text-[#242321]" />
              <p className="text-[11px] sm:text-xs tracking-[2px] uppercase font-semibold text-[#514D47]">
                {tag}
              </p>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#242321] tracking-tight">
            {heading}
          </h1>

          <p className="text-sm sm:text-base text-[#6B665F] mt-4 sm:mt-5 leading-6 sm:leading-7 max-w-lg">
            {subtitle}
          </p>

          {/* Quick Value Highlights */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-7 sm:mt-8 pt-6 border-t border-[#E5E5E0] text-xs sm:text-sm text-[#514D47]">
            <div>
              <p className="font-bold text-lg sm:text-xl text-[#242321]">100%</p>
              <p className="text-xs uppercase tracking-wider text-[#777]">Authentic</p>
            </div>
            <div className="h-8 w-px bg-[#DCDCD7]" />
            <div>
              <p className="font-bold text-lg sm:text-xl text-[#242321]">Premium</p>
              <p className="text-xs uppercase tracking-wider text-[#777]">Quality</p>
            </div>
            <div className="h-8 w-px bg-[#DCDCD7]" />
            <div>
              <p className="font-bold text-lg sm:text-xl text-[#242321]">Express</p>
              <p className="text-xs uppercase tracking-wider text-[#777]">Delivery</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CollectionBanner;

