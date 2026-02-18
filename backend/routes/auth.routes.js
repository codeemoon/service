const express = require("express");
const router = express.Router();
const { register, login, getMe, googleLogin } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", authMiddleware, getMe);

module.exports = router;
