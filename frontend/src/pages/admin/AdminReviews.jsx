import React, { useState, useEffect, useCallback } from "react";
import { Star, Trash2, Search, MessageSquare, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllAdminReviews, deleteReview } from "../../services/admin/adminReviewService";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllAdminReviews({ rating: ratingFilter, page, search, limit: 10 });
      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
      setTotalReviews(data.totalReviews || 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customer reviews.");
    } finally {
      setLoading(false);
    }
  }, [ratingFilter, page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer review?")) return;
    try {
      await deleteReview(id);
      fetchReviews();
    } catch {
      alert("Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm min-w-56">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews by comment..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-9 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          {["", "5", "4", "3", "2", "1"].map((r) => (
            <button
              key={r || "all"}
              type="button"
              onClick={() => { setRatingFilter(r); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                ratingFilter === r ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r ? `${r}★` : "All"}
            </button>
          ))}
          <span className="text-xs font-semibold text-gray-500 ml-2">Total: {totalReviews}</span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl h-64 animate-pulse border border-gray-200" />
      ) : error ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-red-200 shadow-xs">
          <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
          <p className="text-xs font-semibold text-red-600">{error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">No Customer Reviews</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
            Customer product feedback and ratings will appear here for administrative moderation.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-gray-500 font-bold uppercase border-b border-gray-200">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Feedback</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-gray-50/70">
                  <td className="p-4 font-semibold text-gray-900">{rev.customer?.username || "Verified Customer"}</td>
                  <td className="p-4 font-bold text-gray-900">{rev.product?.name || "Product"}</td>
                  <td className="p-4">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-gray-300"} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 max-w-xs">{rev.comment}</td>
                  <td className="p-4 text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button type="button" onClick={() => handleDelete(rev._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
