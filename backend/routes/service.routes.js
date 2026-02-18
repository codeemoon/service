const express = require("express");
const router = express.Router();
const { createService, getServices, getServiceById, getProviderServices, deleteService, updateService } = require("../controllers/service.controller");
const { authMiddleware, providerMiddleware } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

// Public Routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Protected Routes (Provider only)
router.post("/", authMiddleware, providerMiddleware, upload.single("image"), createService);
router.get("/provider/me", authMiddleware, providerMiddleware, getProviderServices);
router.delete("/:id", authMiddleware, providerMiddleware, deleteService);
router.put("/:id", authMiddleware, providerMiddleware, updateService);

module.exports = router;
