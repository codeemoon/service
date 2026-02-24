const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  city: { type: String },
  area: { type: String },
  zipCode: { type: String },
  // Business Details
  businessName: { type: String },
  panNumber: { type: String },
  gstNumber: { type: String },
  // Plan & Status
  plan: { type: String, enum: ["free", "basic", "premium"], default: "free" },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  // Wallet & Ratings
  walletBalance: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Provider = mongoose.model("ServiceProvider", providerSchema);
module.exports = Provider;
