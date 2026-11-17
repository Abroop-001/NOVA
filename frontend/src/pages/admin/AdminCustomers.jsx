import React, { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, AlertCircle, Users } from "lucide-react";
import CustomerTable from "../../components/admin/customers/CustomerTable";
import CustomerDetailModal from "../../components/admin/customers/CustomerDetailModal";
import { getCustomers } from "../../services/admin/adminCustomerService";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = useCallback(async (querySearch, queryPage) => {
    try {
      setLoading(true);
      setError("");
      const data = await getCustomers({ search: querySearch, page: queryPage, limit: 10 });
      setCustomers(data.customers || []);
      setTotalPages(data.totalPages || 1);
      setTotalCustomers(data.totalCustomers || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customers from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(search, page);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page, fetchCustomers]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email or phone..."
            value={search}
            onChange={handleSearchChange}
            className="w-full h-10 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
          />
        </div>
        <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
          Total: {totalCustomers} registered
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl h-80 animate-pulse border border-gray-200" />
      ) : error ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-red-200 shadow-xs">
          <AlertCircle size={28} className="text-red-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => fetchCustomers(search, page)}
            className="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl p-14 text-center border border-gray-200 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Users size={22} />
          </div>
          <p className="text-sm font-bold text-gray-800">No Customers Found</p>
          <p className="text-xs text-gray-500 mt-1">
            {search ? "No customer accounts match your search query." : "Registered customer accounts will appear here."}
          </p>
        </div>
      ) : (
        <>
          <CustomerTable
            customers={customers}
            onViewCustomer={(c) => setSelectedCustomer(c)}
          />

          {totalPages > 1 && (
            <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
};

export default AdminCustomers;
