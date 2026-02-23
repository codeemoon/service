const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const mongoose = require("mongoose");

// Plan → provider income rate
const PLAN_RATES = { free: 0.70, basic: 0.80, premium: 0.90 };


const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: "provider" });
    const totalCustomers = await User.countDocuments({ role: "customer" });
    
    const totalServices = await Service.countDocuments();
    
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue (sum of price of confirmed/completed bookings)
    // Assuming 'completed' means paid/done. You might want to include 'accepted' too depending on business logic.
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ["completed", "accepted"] } } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name email")
      .populate("service", "name");

    res.json({
      totalUsers,
      totalProviders,
      totalCustomers,
      totalServices,
      totalBookings,
      totalRevenue,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all providers with their service count + wallet earnings (70% of paid bookings)
const getProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" })
      .select("name email phone city area profileImage createdAt")
      .lean();

    const providersWithStats = await Promise.all(
      providers.map(async (p) => {
        const serviceCount = await Service.countDocuments({ provider: p._id });

        // Use plan-based rate
        const rate = PLAN_RATES[p.plan] ?? 0.70;
        const earningsData = await Booking.aggregate([
          { $match: { provider: p._id, status: { $in: ["accepted", "completed"] } } },
          { $group: { _id: null, total: { $sum: "$price" } } }
        ]);
        const totalPaid = earningsData.length > 0 ? earningsData[0].total : 0;
        const walletBalance = Math.round(totalPaid * rate * 100) / 100;

        return { ...p, serviceCount, walletBalance };
      })
    );

    res.json(providersWithStats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Provider: get own wallet balance (plan-based rate)
const getProviderWallet = async (req, res) => {
  try {
    const provider = await User.findById(req.user.id).select("plan");
    const rate = PLAN_RATES[provider?.plan] ?? 0.70;

    const providerId = new mongoose.Types.ObjectId(req.user.id);
    const earningsData = await Booking.aggregate([
      { $match: { provider: providerId, status: { $in: ["accepted", "completed"] } } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalPaid = earningsData.length > 0 ? earningsData[0].total : 0;
    const walletBalance = Math.round(totalPaid * rate * 100) / 100;
    res.json({ walletBalance, plan: provider?.plan ?? "free", rate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAdminStats, getProviders, getProviderWallet };
