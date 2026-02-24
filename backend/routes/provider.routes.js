const express = require("express");
const router = express.Router();
const { registerProvider, loginProvider, getProviderProfile, updateProviderProfile, checkProviderEmail } = require("../controllers/provider.controller");
const { authMiddleware, providerMiddleware } = require("../middlewares/auth.middleware");

router.post("/register", registerProvider);
router.post("/login", loginProvider);
router.post("/check-email", checkProviderEmail);
router.get("/me", authMiddleware, providerMiddleware, getProviderProfile);
router.put("/me", authMiddleware, providerMiddleware, updateProviderProfile);

module.exports = router;
