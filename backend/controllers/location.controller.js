const Location = require("../models/location.model");

// Admin: Add new location
exports.addLocation = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Location name is required" });

        const newLocation = new Location({ name: name.trim() });
        await newLocation.save();

        res.status(201).json(newLocation);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Location already exists" });
        }
        res.status(500).json({ message: "Error adding location", error: error.message });
    }
};

// Admin: Toggle location status
exports.toggleLocationStatus = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found" });

        location.isActive = !location.isActive;
        await location.save();

        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: "Error updating location", error: error.message });
    }
};

// Admin: Delete location
exports.deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting location", error: error.message });
    }
};

// Public: Get all active locations (or Admin: Get all locations)
exports.getLocations = async (req, res) => {
    try {
        // If admin requests, they might want all. For now, just return all, frontend can filter or admin can see all.
        // Actually, let's just return all locations, and frontend public will only use active ones, or we can filter by query.
        const filter = req.query.activeOnly === 'true' ? { isActive: true } : {};
        const locations = await Location.find(filter).sort({ name: 1 });
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching locations", error: error.message });
    }
};
