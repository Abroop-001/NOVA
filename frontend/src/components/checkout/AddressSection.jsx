import { useState } from "react";
import { MapPin, Plus, Check, ChevronDown, ChevronUp } from "lucide-react";
import NewAddressForm from "./NewAddressForm";

const AddressSection = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  onAddAddress,
  loading,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(true);

  if (loading) {
    return (
      <section>
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#171717] mb-5">
          Delivery Address
        </h2>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-[#F5F5F5] rounded-lg" />
          <div className="h-20 bg-[#F5F5F5] rounded-lg" />
        </div>
      </section>
    );
  }

  const handleAdd = async (data) => {
    const result = await onAddAddress(data);
    if (result?.success) setShowForm(false);
    return result;
  };

  return (
    <section>
      <button
        type="button"
        className="w-full flex items-center justify-between mb-5"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-sm font-bold tracking-[0.15em] uppercase text-[#171717]">
          Delivery Address
        </h2>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <button
              key={addr._id}
              type="button"
              onClick={() => setSelectedAddressId(addr._id)}
              className={`w-full text-left p-4 rounded-lg border transition cursor-pointer ${
                selectedAddressId === addr._id
                  ? "border-[#171717] bg-[#FAFAFA]"
                  : "border-[#EAEAEA] hover:border-[#CCCCCC]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <MapPin
                    size={16}
                    className="text-[#777777] mt-0.5 shrink-0"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-[#171717]">
                      {addr.fullName}
                      {addr.isDefault && (
                        <span className="ml-2 text-[10px] font-semibold tracking-wider uppercase bg-[#171717] text-white px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-[#777777] mt-1 leading-relaxed">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                      <br />
                      {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="text-[#999999] text-xs mt-1">{addr.phone}</p>
                  </div>
                </div>
                {selectedAddressId === addr._id && (
                  <Check size={18} className="text-[#171717] shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          ))}

          {/* Add new address toggle */}
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 border border-dashed border-[#CCCCCC] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#555555] hover:border-[#171717] hover:text-[#171717] transition cursor-pointer"
            >
              <Plus size={14} />
              Add New Address
            </button>
          ) : (
            <NewAddressForm
              onSubmit={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default AddressSection;

