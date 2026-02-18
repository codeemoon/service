const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate reviews from same user for same service
reviewSchema.index({ service: 1, customer: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
