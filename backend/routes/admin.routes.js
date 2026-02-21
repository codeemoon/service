const express = require("express");
const router = express.Router();
const { getAdminStats, getProviders, getProviderWallet } = require("../controllers/admin.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);
router.get("/providers", authMiddleware, adminMiddleware, getProviders);
// Provider's own wallet — any authenticated provider can call this
router.get("/wallet", authMiddleware, getProviderWallet);

module.exports = router;
