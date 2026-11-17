import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ProductAccordion = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!product) return null;

  return (
    <section className="mt-14 sm:mt-18">
      {/* Heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[3px] font-medium text-[#999999] mb-2">
            Discover more
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#171717]">
            PRODUCT DESCRIPTION
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Show less product information" : "Show more product information"}
          className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#DDDDDD] flex items-center justify-center hover:border-[#171717] transition-colors"
        >
          <ChevronDown
            size={20}
            strokeWidth={1.6}
            className={`text-[#171717] transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Description Preview */}
      <p
        className={`mt-4 text-sm sm:text-base text-[#666666] leading-7 max-w-4xl ${
          isOpen ? "" : "line-clamp-3"
        }`}
      >
        {product.description ||
          "Discover the design, comfort and character of this sneaker."}
      </p>

      {/* Expandable Information */}
      {isOpen && (
        <div className="pt-7 pb-5 animate-in fade-in duration-300">
          {/* Product Details */}
          <div className="max-w-3xl">
            <h3 className="text-lg sm:text-xl font-semibold text-[#171717] mb-4">
              Product Details
            </h3>

            <div className="text-sm sm:text-base text-[#555555] leading-8 space-y-1">
              <p>
                <span className="text-[#888888]">Brand:</span>{" "}
                {product.brand || "N/A"}
              </p>

              <p>
                <span className="text-[#888888]">Category:</span>{" "}
                {product.category || "N/A"}
              </p>

              {product.colors?.length > 0 && (
                <p>
                  <span className="text-[#888888]">Colours:</span>{" "}
                  {product.colors.join(", ")}
                </p>
              )}

              {product.sizes?.length > 0 && (
                <p>
                  <span className="text-[#888888]">Available Sizes:</span>{" "}
                  UK {product.sizes.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="mt-8 max-w-4xl">
            <h3 className="text-lg sm:text-xl font-semibold text-[#171717] mb-2">
              Shipping & Delivery
            </h3>

            <p className="text-sm sm:text-base text-[#666666] leading-7">
              Every pair is packaged in premium double-boxed protection and
              dispatched within 24–48 hours. Tracked shipping is provided with
              real-time SMS updates.
            </p>
          </div>

          {/* Authenticity */}
          <div className="mt-8 max-w-4xl">
            <h3 className="text-lg sm:text-xl font-semibold text-[#171717] mb-2">
              Authenticity & Returns
            </h3>

            <p className="text-sm sm:text-base text-[#666666] leading-7">
              Every pair is individually inspected and guaranteed authentic
              by NOVA sneaker specialists. Enjoy 30-day hassle-free returns
              on unworn sneakers in their original packaging.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductAccordion;