const express = require("express");
const router = express.Router();
const { createService, getServices, getServiceById, getProviderServices, deleteService, updateService, getServiceSlots } = require("../controllers/service.controller");
const { authMiddleware, providerMiddleware } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

// Public Routes
router.get("/", getServices);
router.get("/:id", getServiceById);
router.get("/:id/slots", getServiceSlots);

// Protected Routes (Provider only)
router.post("/", authMiddleware, providerMiddleware, upload.single("image"), createService);
router.get("/provider/me", authMiddleware, providerMiddleware, getProviderServices);
router.delete("/:id", authMiddleware, providerMiddleware, deleteService);
router.put("/:id", authMiddleware, providerMiddleware, upload.single("image"), updateService);

module.exports = router;
