import { useState } from "react";
import { X, Star, Loader } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const ReviewModal = ({ booking, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please add a comment");

    setSubmitting(true);
    try {
      await api.post("/reviews", {
        serviceId: booking.service._id,
        bookingId: booking._id,
        rating,
        comment
      });
      toast.success("Review submitted! Thank you.");
      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error("Failed to submit review", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-md relative z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Rate Service</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-400 mb-6 font-medium">
          How was your experience with <span className="text-white">{booking.service?.name}</span>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= rating ? "text-yellow-500 fill-current" : "text-gray-700 hover:text-gray-500"
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Your Review</label>
            <textarea
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 outline-none h-32 resize-none transition-colors"
              placeholder="Tell us what you liked or what could be improved..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center"
          >
            {submitting ? <Loader className="animate-spin w-5 h-5" /> : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
