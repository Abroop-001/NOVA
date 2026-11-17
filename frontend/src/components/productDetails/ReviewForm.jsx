import React, { useState } from "react";
import { Star, AlertCircle, CheckCircle2, LogIn } from "lucide-react";
import { addReview } from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { isLoggedIn, openAuthModal } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    if (!comment.trim() || comment.trim().length < 3) {
      setError("Please enter a review comment of at least 3 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      await addReview({ productId, rating, comment: comment.trim() });
      setSuccess("Thank you! Your verified review has been submitted.");
      setComment("");
      setRating(5);
      if (onReviewSubmitted) onReviewSubmitted();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (status === 403) {
        setError(msg || "Only verified buyers who have received this product (Delivered) can submit a review.");
      } else {
        setError(msg || "Failed to submit review. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#FAF9F6] border border-[#EAEAEA] p-5 sm:p-6 rounded-2xl">
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#171717] mb-2">Write a Customer Review</h3>
      <p className="text-xs text-[#777777] mb-4">Share your feedback on comfort, sizing and fit.</p>

      {!isLoggedIn && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs flex items-center gap-2">
          <LogIn size={15} className="shrink-0" />
          <span>
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="font-semibold underline underline-offset-2 cursor-pointer hover:opacity-70"
            >
              Sign in
            </button>{" "}
            to write a review. Only verified buyers can submit reviews.
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Rating</label>
        <div className="flex items-center gap-1 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none cursor-pointer"
            >
              <Star
                size={20}
                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-300"}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-[#171717] ml-2">{rating} out of 5</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#171717] mb-1.5">Your Feedback</label>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How did this sneaker fit? How is the material quality?"
          className="w-full p-3 text-xs bg-white border border-[#EAEAEA] rounded-xl outline-none focus:border-black transition"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 bg-[#171717] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition disabled:opacity-50 cursor-pointer"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
