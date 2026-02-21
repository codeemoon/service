const Service = require("../models/service.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Create Service (Provider only)
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category, startTime, endTime } = req.body;

    if (!name || !description || !price || !duration || !category || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    let imageUrl = "";
    if (req.file) {
      console.log("File received:", req.file); // DEBUG
      const uploadResponse = await uploadOnCloudinary(req.file.path);
      console.log("Cloudinary Response:", uploadResponse); // DEBUG
      if (uploadResponse) {
        imageUrl = uploadResponse.url;
      }
    } else {
        console.log("No file received"); // DEBUG
    }

    const newService = new Service({
      name,
      description,
      price,
      duration,
      category,
      startTime,
      endTime,
      provider: req.user.id, // Set provider from auth token
      image: imageUrl, // Save Cloudinary URL
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Services (Public - with optional filters)
const getAllServices = async (req, res) => {
  try {
    const { category, search, provider, location } = req.query;
    let query = { availability: { $ne: false } };

    if (category) {
      query.category = category;
    }

    if (provider) {
      query.provider = provider;
    }

    if (location) {
      // Find providers who match City OR District OR ZipCode
      const providersInLocation = await User.find({
        $and: [
          { role: "provider" },
          {
            $or: [
              { city: { $regex: location, $options: "i" } },
              { district: { $regex: location, $options: "i" } },
              { zipCode: { $regex: location, $options: "i" } }
            ]
          }
        ]
      }).select("_id");

      const providerIds = providersInLocation.map(p => p._id);

      if (query.provider) {
        const isProviderLocal = providerIds.some(id => id.toString() === query.provider);
        if (!isProviderLocal) return res.json([]);
      } else {
        query.provider = { $in: providerIds };
      }
    }


    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const services = await Service.find(query)
      .populate("category", "name")
      .populate("provider", "name email");
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Service by ID (Public)
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category", "name")
      .populate("provider", "name email");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Service (Provider/Admin)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Ensure resource ownership
    if (service.provider.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this service" });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Provider's Services (Protected)
const getProviderServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user.id }).populate("category", "name");
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Service (Provider only)
const updateService = async (req, res) => {
  try {
    const { name, description, price, duration, category, startTime, endTime } = req.body;
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this service" });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price || service.price;
    service.duration = duration || service.duration;
    service.category = category || service.category;
    service.startTime = startTime || service.startTime;
    service.endTime = endTime || service.endTime;

    if (req.file) {
        const uploadResponse = await uploadOnCloudinary(req.file.path);
        if (uploadResponse) {
            service.image = uploadResponse.url;
        }
    }

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Available slots for a service on a specific date
const getServiceSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // Format YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Parse Service Start/End Times
    const [startHour, startMinute] = service.startTime.split(":").map(Number);
    const [endHour, endMinute] = service.endTime.split(":").map(Number);
    
    // Create Date objects for the service hours on the requested date
    const serviceStart = new Date(date);
    serviceStart.setHours(startHour, startMinute, 0, 0);

    const serviceEnd = new Date(date);
    serviceEnd.setHours(endHour, endMinute, 0, 0);

    // Fetch existing bookings for this service on this date
    // We need to match bookings that fall on this day.
    // Assuming Bookings stored as specific Date objects.
    const Booking = require("../models/booking.model");
    
    // Define the range for the entire day (00:00 to 23:59) to catch all bookings
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      service: id,
      status: { $nin: ["cancelled", "rejected"] }, // Ignore cancelled/rejected
      scheduledDate: { $gte: dayStart, $lte: dayEnd }
    });

    const bookedTimes = bookings.map(b => {
        const d = new Date(b.scheduledDate);
        return d.getTime(); // Return timestamp for easier comparison
    });

    // Generate Slots
    let slots = [];
    let currentSlot = new Date(serviceStart);

    while (currentSlot < serviceEnd) {
        const slotTime = currentSlot.getTime();
        
        // Check if this slot collides with any existing booking
        // Simple collision: if the exact start time matches (Assuming fixed duration slots)
        // For more complex duration overlaps, we'd need to check ranges.
        // Given the requirement is likely simple fixed slots based on service duration:
        
        const isBooked = bookedTimes.includes(slotTime);
        
        if (!isBooked) {
             // Format slot as "HH:mm"
             const hours = currentSlot.getHours().toString().padStart(2, '0');
             const minutes = currentSlot.getMinutes().toString().padStart(2, '0');
             slots.push(`${hours}:${minutes}`);
        }

        // Increment by duration
        currentSlot.setMinutes(currentSlot.getMinutes() + service.duration);
    }

    res.json(slots);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  createService,
  getServices: getAllServices,
  getServiceById,
  deleteService,
  getProviderServices,
  updateService,
  getServiceSlots
};
