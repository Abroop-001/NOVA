import React from "react";
import { MapPin, Phone, Edit2, Trash2, CheckCircle2 } from "lucide-react";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSettingDefault,
  isDeleting,
}) => {
  return (
    <div
      className={`relative p-5 sm:p-6 rounded-2xl border transition-all duration-200 bg-white flex flex-col justify-between ${
        address.isDefault
          ? "border-[#171717] ring-1 ring-[#171717]"
          : "border-[#EAEAEA] hover:border-[#CCCCCC]"
      }`}
    >
      <div>
        {/* Header: Name and Default Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-[#171717]">
              {address.fullName}
            </h3>
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-[#171717] text-white px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={11} />
                Default
              </span>
            )}
          </div>
        </div>

        {/* Address Body */}
        <div className="text-xs sm:text-sm text-[#555555] space-y-1 leading-relaxed">
          <p className="flex items-start gap-2">
            <MapPin size={15} className="text-[#999999] mt-0.5 shrink-0" />
            <span>
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ""}
              <br />
              {address.city}, {address.state} – {address.pincode}
              <br />
              <span className="text-[#888888]">{address.country || "India"}</span>
            </span>
          </p>

          <p className="flex items-center gap-2 text-[#777777] pt-1.5">
            <Phone size={14} className="text-[#999999] shrink-0" />
            <span>{address.phone}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 border-t border-[#F0F0F0]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#555555] transition"
          >
            <Edit2 size={13} />
            Edit
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onDelete(address._id)}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-700 disabled:opacity-50 transition"
          >
            <Trash2 size={13} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {!address.isDefault && (
          <button
            type="button"
            disabled={isSettingDefault}
            onClick={() => onSetDefault(address._id)}
            className="text-xs font-medium text-[#777777] hover:text-[#171717] underline underline-offset-4 disabled:opacity-50 transition"
          >
            {isSettingDefault ? "Updating..." : "Set as Default"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;

