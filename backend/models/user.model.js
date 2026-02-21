const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "provider", "admin"],
    default: "customer",
  },
  plan: {
    type: String,
    enum: ["free", "basic", "premium"],
    default: "free",
  },
  phone: {
    type: String,
  },
  city: {
    type: String,
    required: false,
  },
  district: {
    type: String,
    required: false,
  },
  zipCode: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String, // Storing hashed OTP
  },
  otpExpires: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
