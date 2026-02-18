const User = require("../models/user.model");
const Service = require("../models/service.model");

// Delete user account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cascade delete logic
        if (user.role === "provider") {
            // Delete all services offered by this provider
            const services = await Service.find({ provider: userId });
            const deletedServices = await Service.deleteMany({ provider: userId });
            console.log(`Deleted ${deletedServices.deletedCount} services for provider ${user.email}`);
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.json({ message: "Account and associated data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { deleteAccount };
