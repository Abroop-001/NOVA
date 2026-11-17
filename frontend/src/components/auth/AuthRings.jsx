import React from "react";

const AuthRings = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]">
      {/* Top-right decorative circular ring */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full border-[28px] border-[#F3F4F6] opacity-75"
        aria-hidden="true"
      />

      {/* Bottom-left decorative circular ring */}
      <div
        className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full border-[32px] border-[#F3F4F6] opacity-75"
        aria-hidden="true"
      />
    </div>
  );
};

export default AuthRings;
