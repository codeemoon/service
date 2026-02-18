const Review = require("../models/review.model");
const Service = require("../models/service.model");
const Booking = require("../models/booking.model"); // Optional: verify if user booked the service

// Add Review
const addReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;

    if (!serviceId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // verification: Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Optional: Check if user has actually booked and completed this service
    // For now, we'll skip this strict check to make testing easier, 
    // but in production, you'd check Booking model here.

    const newReview = new Review({
      service: serviceId,
      customer: req.user.id,
      rating,
      comment,
    });

    await newReview.save();

    // Update Service Average Rating
    const reviews = await Review.find({ service: serviceId });
    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    service.rating = avgRating;
    service.numReviews = reviews.length;
    await service.save();

    res.status(201).json(newReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this service" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Reviews for a Service
const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await Review.find({ service: serviceId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addReview, getServiceReviews };
