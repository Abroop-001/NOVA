
import { useState } from "react";

const INITIAL = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const NewAddressForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};

    if (!form.fullName.trim()) e.fullName = "Required";

    if (!form.phone.trim()) e.phone = "Required";
    else if (!/^\d{10}$/.test(form.phone.trim())) {
      e.phone = "Enter 10-digit number";
    }

    if (!form.addressLine1.trim()) e.addressLine1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";

    if (!form.pincode.trim()) e.pincode = "Required";
    else if (!/^\d{6}$/.test(form.pincode.trim())) {
      e.pincode = "Enter 6-digit PIN";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    try {
      const result = await onSubmit(form);

      if (!result?.success) {
        setErrors({
          general: result?.message || "Failed to save address",
        });
      }
    } catch {
      setErrors({
        general: "Failed to save address. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-11 px-3.5 border border-[#EAEAEA] rounded-lg bg-white text-sm text-[#171717] placeholder:text-[#AAAAAA] outline-none focus:border-[#171717] transition";

  return (
    <div className="p-5 border border-[#EAEAEA] rounded-lg bg-[#FAFAFA]">
      <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[#171717] mb-4">
        New Address
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className={inputClass}
          />
          {errors.fullName && (
            <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            maxLength={10}
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
          />
          {errors.phone && (
            <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <input
            placeholder="Address line 1"
            value={form.addressLine1}
            onChange={(e) => set("addressLine1", e.target.value)}
            className={inputClass}
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-[11px] mt-1">
              {errors.addressLine1}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <input
            placeholder="Address line 2 (optional)"
            value={form.addressLine2}
            onChange={(e) => set("addressLine2", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className={inputClass}
          />
          {errors.city && (
            <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <input
            placeholder="State"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            className={inputClass}
          />
          {errors.state && (
            <p className="text-red-500 text-[11px] mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <input
            maxLength={6}
            placeholder="PIN code"
            value={form.pincode}
            onChange={(e) => set("pincode", e.target.value)}
            className={inputClass}
          />
          {errors.pincode && (
            <p className="text-red-500 text-[11px] mt-1">{errors.pincode}</p>
          )}
        </div>

        <div>
          <input
            placeholder="Country"
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {errors.general && (
        <p className="text-red-500 text-xs mt-3">{errors.general}</p>
      )}

      <div className="flex gap-3 mt-5">
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-black disabled:bg-[#999999] transition cursor-pointer"
        >
          {submitting ? "Saving…" : "Save Address"}
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={onCancel}
          className="px-6 py-2.5 border border-[#EAEAEA] text-[#555555] text-xs font-semibold uppercase tracking-wider rounded-lg hover:border-[#171717] hover:text-[#171717] disabled:opacity-50 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewAddressForm;
