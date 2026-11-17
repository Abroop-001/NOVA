import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AddressList from "../../components/addresses/AddressList";
import AddressForm from "../../components/addresses/AddressForm";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../services/addressService";

const MyAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAddresses();
      setAddresses(data.addresses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load saved addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/addresses" } });
      return;
    }
    fetchAddresses();
  }, [navigate, fetchAddresses]);

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData);
      } else {
        await addAddress(formData);
      }
      setShowForm(false);
      setEditingAddress(null);
      await fetchAddresses();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    setDeletingId(addressId);
    try {
      await deleteAddress(addressId);
      await fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    setActionLoadingId(addressId);
    try {
      await setDefaultAddress(addressId);
      await fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update default address");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAEAEA] mb-8">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#777777] uppercase">
              Account Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] mt-0.5">
              Saved Addresses
            </h1>
            <p className="text-xs text-[#777777] mt-1 font-light">
              Manage your delivery locations for faster, hassle-free checkout.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#EAEAEA] text-xs font-semibold uppercase tracking-wider text-[#171717] rounded-xl hover:bg-[#F9F9F9] transition"
            >
              <ArrowLeft size={14} />
              Profile
            </button>

            {!showForm && (
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition cursor-pointer"
              >
                <Plus size={15} />
                Add Address
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8">
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingAddress(null);
              }}
              submitting={submitting}
            />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-[#F5F5F5] border border-[#EAEAEA]" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center max-w-md mx-auto">
            <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
            <p className="text-sm text-[#777777] mb-4">{error}</p>
            <button
              onClick={fetchAddresses}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        ) : (
          <AddressList
            addresses={addresses}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
            onAddNew={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            actionLoadingId={actionLoadingId}
            deletingId={deletingId}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyAddresses;

