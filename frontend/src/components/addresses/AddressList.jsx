import React from "react";
import { MapPin, Plus } from "lucide-react";
import AddressCard from "./AddressCard";

const AddressList = ({
  addresses = [],
  onEdit,
  onDelete,
  onSetDefault,
  onAddNew,
  actionLoadingId,
  deletingId,
}) => {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-dashed border-[#EAEAEA] rounded-2xl bg-[#FAF9F6]/30">
        <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto mb-4 text-[#777777]">
          <MapPin size={26} />
        </div>
        <h3 className="text-base font-bold uppercase tracking-wider text-[#171717]">
          No Addresses Saved
        </h3>
        <p className="text-xs text-[#777777] max-w-sm mx-auto mt-1.5 mb-6 leading-relaxed">
          You haven't saved any delivery addresses yet. Add one now to enjoy rapid checkout on your future orders.
        </p>
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition cursor-pointer"
        >
          <Plus size={15} />
          Add Your First Address
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          isSettingDefault={actionLoadingId === address._id}
          isDeleting={deletingId === address._id}
        />
      ))}
    </div>
  );
};

export default AddressList;

