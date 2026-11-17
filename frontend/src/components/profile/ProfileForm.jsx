import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Edit2, Check, X, AlertCircle } from "lucide-react";
import ProfileField from "./ProfileField";

const ProfileForm = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = formData.username.trim();
    if (!trimmed || trimmed.length < 3) {
      setMessage({ type: "error", text: "Username must be at least 3 characters long." });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      if (onUpdateUser) {
        await onUpdateUser({ username: trimmed, phone: formData.phone.trim() });
      }
      setMessage({ type: "success", text: "Profile details updated successfully." });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile. Please try again."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-[#F0F0F0]">
        <div>
          <h2 className="text-base font-bold tracking-tight text-[#171717] uppercase">Personal Information</h2>
          <p className="text-xs text-[#777777] mt-0.5">Your contact and identification details</p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#555555] transition"
          >
            <Edit2 size={13} /> Edit Profile
          </button>
        )}
      </div>

      {message.text && (
        <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-xs font-medium ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.type === "success" ? <Check size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <ProfileField
          label="Full Name / Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          editable={isEditing}
          icon={User}
          placeholder="Enter your name"
        />
        <ProfileField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          editable={false}
          icon={Mail}
          placeholder="Email address"
        />
        <ProfileField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          editable={isEditing}
          icon={Phone}
          placeholder="e.g. +91 98765 43210"
        />
      </div>

      {isEditing && (
        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition disabled:opacity-50"
          >
            <Check size={14} /> {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#EAEAEA] bg-white text-[#171717] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#F9F9F9] transition"
          >
            <X size={14} /> Cancel
          </button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
