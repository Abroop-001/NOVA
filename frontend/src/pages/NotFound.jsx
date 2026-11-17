import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-lg mx-auto">
        <span className="text-7xl sm:text-8xl font-black tracking-tight text-[#171717] select-none">
          404
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] mt-4 uppercase">
          Page Not Found
        </h1>
        <p className="text-sm text-[#777777] mt-2 mb-8 leading-relaxed max-w-md">
          The footwear silhouette or page you are looking for does not exist, has been retired, or moved to another destination.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition"
        >
          <ArrowLeft size={15} />
          Return to Store
        </Link>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
