const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/admin.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

module.exports = router;
