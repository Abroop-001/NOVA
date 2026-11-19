import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Categories = () => {
  return (
    <section className=" px-10 lg:px-16 py-16">

      {/* Heading */}
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[3px] text-[#555555] mb-3">
          Explore Collections
        </p>

        <h2 className="text-4xl font-bold text-[#171717]">
          Shop by Brand
        </h2>

        <p className="text-[#555555] mt-3">
          Explore sneakers from your favourite brands.
        </p>
      </div>

      {/* Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Nike */}
        <Link to="/nike" className="group">
          <div className="h-70 bg-[#F5F5F2] rounded-xl overflow-hidden">
            <img
              src="/nike.png"
              alt="Nike sneakers"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <h3 className="text-xl font-semibold text-[#171717]">Nike</h3>
            <ArrowRight size={20} className="text-[#333333] group-hover:translate-x-2 transition duration-300" />
          </div>
        </Link>

        {/* Adidas */}
        <Link to="/adidas" className="group">
          <div className="h-70 bg-[#F5F5F2] rounded-xl overflow-hidden">
            <img
              src="/adidas.png"
              alt="Adidas sneakers"
              className="w-full h-full  object-cover translate-y-1 group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <h3 className="text-xl font-semibold text-[#171717]">Adidas</h3>
            <ArrowRight size={20} className="text-[#333333] group-hover:translate-x-2 transition duration-300" />
          </div>
        </Link>

        {/* Puma */}
        <Link to="/puma" className="group">
          <div className="h-70 bg-[#F5F5F2] rounded-xl overflow-hidden">
            <img
              src="/puma-shoe.png"
              alt="Puma sneakers"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <h3 className="text-xl font-semibold text-[#171717]">Puma</h3>
            <ArrowRight size={20} className="text-[#333333] group-hover:translate-x-2 transition duration-300" />
          </div>
        </Link>

      </div>
    </section>
  );
};

export default Categories;