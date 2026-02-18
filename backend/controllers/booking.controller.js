const Booking = require("../models/booking.model");
const Service = require("../models/service.model");

// Create Booking (Customer)
const createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledDate, address, notes } = req.body;

    if (!serviceId || !scheduledDate || !address) {
      return res.status(400).json({ message: "Service, date, and address are required" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = new Booking({
      customer: req.user.id,
      provider: service.provider,
      service: serviceId,
      scheduledDate,
      address,
      notes,
      price: service.price, // Lock in the price
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Bookings (Customer: My bookings, Provider: Assigned bookings)
const getBookings = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "customer") {
      query.customer = req.user.id;
    } else if (req.user.role === "provider") {
      query.provider = req.user.id;
    } 
    // Admins can see all, so no filter needed for them if not specified above

    const bookings = await Booking.find(query)
      .populate("service", "name price image")
      .populate("customer", "name email phone")
      .populate("provider", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Booking Status (Provider/Customer/Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    console.log(`[UpdateStatus] Request: ID=${id}, Status=${status}, User=${req.user.id}, Role=${req.user.role}`);

    const validStatuses = ["pending", "accepted", "rejected", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      console.log(`[UpdateStatus] Invalid status: ${status}`);
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      console.log(`[UpdateStatus] Booking not found: ${id}`);
      return res.status(404).json({ message: "Booking not found" });
    }
    
    // Authorization check
    if (req.user.role === "provider") {
      if (booking.provider.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this booking" });
      }
    } else if (req.user.role === "customer") {
      // Customers can ONLY cancel their own PENDING bookings
      if (booking.customer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to access this booking" });
      }
      if (status !== "cancelled") {
        return res.status(403).json({ message: "Customers can only cancel bookings" });
      }
      if (booking.status !== "pending") {
        return res.status(400).json({ message: "Can only cancel pending bookings" });
      }
    }
    // Admin can do anything
    
    booking.status = status;
    await booking.save();
    
    console.log(`[UpdateStatus] Success`);
    res.json(booking);
  } catch (error) {
    console.error(`[UpdateStatus] Error:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
