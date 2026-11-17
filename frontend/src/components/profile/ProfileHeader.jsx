import React from "react";

const ProfileHeader = ({ name = "", email = "" }) => {
  const initial = (name || email || "U").trim().charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-5 pb-8 border-b border-[#EAEAEA]">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl tracking-tight shadow-sm shrink-0">
        {initial}
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] font-semibold tracking-[0.25em] text-[#777777] uppercase">
          My Account
        </span>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] mt-0.5">
          {name || "Welcome Back"}
        </h1>
        <p className="text-xs sm:text-sm text-[#777777] mt-1 font-light">
          Manage your personal details, saved addresses, and order history.
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;

