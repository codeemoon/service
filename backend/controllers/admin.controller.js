const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Service = require("../models/service.model");

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

module.exports = { getAdminStats };
