import React, { useState, useEffect } from "react";
import { Check, X, AlertCircle } from "lucide-react";

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const AddressForm = ({ initialData, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        addressLine1: initialData.addressLine1 || "",
        addressLine2: initialData.addressLine2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        country: initialData.country || "India",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setErrorMsg("");
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.trim())) errs.phone = "Must be a 10-digit number";
    if (!form.addressLine1.trim()) errs.addressLine1 = "Address line 1 is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.pincode.trim()) errs.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = "Must be a 6-digit PIN code";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit(form);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to save address");
    }
  };

  const inputCls = (field) =>
    `w-full h-11 px-3.5 border rounded-xl text-sm transition outline-none ${
      errors[field]
        ? "border-red-400 bg-red-50/20 text-red-900"
        : "border-[#EAEAEA] bg-white text-[#171717] focus:border-[#171717]"
    }`;

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-[#EAEAEA] bg-[#FAF9F6]/50 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
        <h3 className="text-sm font-bold tracking-wider uppercase text-[#171717]">
          {initialData ? "Edit Delivery Address" : "Add New Delivery Address"}
        </h3>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
          <AlertCircle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className={inputCls("fullName")} />
          {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <input name="phone" placeholder="10-digit Phone Number" value={form.phone} onChange={handleChange} className={inputCls("phone")} />
          {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <input name="addressLine1" placeholder="Flat, House no., Building, Street" value={form.addressLine1} onChange={handleChange} className={inputCls("addressLine1")} />
          {errors.addressLine1 && <p className="text-red-500 text-[11px] mt-1">{errors.addressLine1}</p>}
        </div>
        <div className="sm:col-span-2">
          <input name="addressLine2" placeholder="Area, Landmark, Sector (Optional)" value={form.addressLine2} onChange={handleChange} className={inputCls("addressLine2")} />
        </div>
        <div>
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className={inputCls("city")} />
          {errors.city && <p className="text-red-500 text-[11px] mt-1">{errors.city}</p>}
        </div>
        <div>
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} className={inputCls("state")} />
          {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state}</p>}
        </div>
        <div>
          <input name="pincode" placeholder="6-digit PIN Code" value={form.pincode} onChange={handleChange} className={inputCls("pincode")} />
          {errors.pincode && <p className="text-red-500 text-[11px] mt-1">{errors.pincode}</p>}
        </div>
        <div>
          <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className={inputCls("country")} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black disabled:opacity-50 transition cursor-pointer"
        >
          <Check size={14} />
          {submitting ? "Saving..." : initialData ? "Save Changes" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-6 py-3 border border-[#EAEAEA] bg-white text-[#171717] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#F9F9F9] transition cursor-pointer"
        >
          <X size={14} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;

