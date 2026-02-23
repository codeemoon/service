const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

// Public
router.get("/", locationController.getLocations);

// Admin Only
router.post("/", authMiddleware, adminMiddleware, locationController.addLocation);
router.patch("/:id/toggle", authMiddleware, adminMiddleware, locationController.toggleLocationStatus);
router.delete("/:id", authMiddleware, adminMiddleware, locationController.deleteLocation);

module.exports = router;
