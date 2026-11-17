import React, { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare } from "lucide-react";
import { getProductReviews } from "../../services/reviewService";
import ReviewForm from "./ReviewForm";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const data = await getProductReviews(productId);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <section className="mt-14 pt-10 border-t border-[#EAEAEA]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#777777] font-semibold mb-1">
            Customer Feedback
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
            Reviews & Ratings ({totalReviews})
          </h2>
        </div>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2 bg-[#FAF9F6] border border-[#EAEAEA] px-4 py-2 rounded-xl">
            <span className="text-lg font-extrabold text-[#171717]">{averageRating}</span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                  className={i < Math.round(averageRating) ? "text-amber-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-xs text-[#777777]">({totalReviews})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 border border-dashed border-[#EAEAEA] rounded-2xl text-center">
              <MessageSquare size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-xs font-semibold text-gray-700">No reviews yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first verified customer to share your thoughts!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-4 sm:p-5 border border-[#EAEAEA] rounded-2xl bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center">
                      {(rev.user?.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#171717]">{rev.user?.username || "Verified Customer"}</p>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Verified Purchase</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < rev.rating ? "currentColor" : "none"}
                      className={i < rev.rating ? "text-amber-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Review Submission Form */}
        <div className="lg:col-span-5">
          <ReviewForm productId={productId} onReviewSubmitted={fetchReviews} />
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
