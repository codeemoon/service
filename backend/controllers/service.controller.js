const Service = require("../models/service.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Create Service (Provider only)
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;

    if (!name || !description || !price || !duration || !category) {
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
    let query = { availability: true };

    if (category) {
      query.category = category;
    }

    if (provider) {
      query.provider = provider;
    }

    if (location) {
        // location param could be anything now, but usually passed as a single string from Navbar
        // For now, let's treat 'location' as a general search term against ALL location fields
        
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
        
        // If we already have a provider filter, we must ensure that specific provider is ALSO in the location
        if (query.provider) {
            // Check if the specific provider is in the list of local providers
            const isProviderLocal = providerIds.some(id => id.toString() === query.provider);
            if (!isProviderLocal) {
                // If the specific provider isn't in the location, return no results
                return res.json([]); 
            }
            // query.provider remains as is
        } else {
            // Filter services by these providers
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
    const { name, description, price, duration, category } = req.body;
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

    await service.save();
    res.json(service);
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
  updateService
};
