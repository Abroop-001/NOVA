import React from "react";

const ProfileField = ({
  label,
  value,
  icon: Icon,
  editable,
  onChange,
  name,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#777777] pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={!editable}
          placeholder={placeholder || "Not provided"}
          className={`w-full h-12 rounded-xl border text-sm transition-all duration-200 outline-none ${
            Icon ? "pl-11 pr-4" : "px-4"
          } ${
            editable
              ? "border-[#171717] bg-white text-[#171717] focus:ring-1 focus:ring-[#171717]"
              : "border-[#EAEAEA] bg-[#FAF9F6]/50 text-[#171717] cursor-not-allowed"
          }`}
        />
      </div>
    </div>
  );
};

export default ProfileField;

