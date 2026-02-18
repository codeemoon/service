const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBookingStatus,
} = require("../controllers/booking.controller");
const { authMiddleware, providerMiddleware } = require("../middlewares/auth.middleware");

// All routes require login
router.use(authMiddleware);

router.post("/", createBooking); // Customer creates
router.get("/", getBookings); // Customer/Provider sees theirs
router.put("/:id/status", updateBookingStatus); // Authorized internally in controller

module.exports = router;
