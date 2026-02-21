const express = require("express");
const router = express.Router();
const { register, checkEmail, login, getMe, googleLogin, sendVerificationOTP, verifyEmailOTP } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/check-email", checkEmail);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/send-otp", sendVerificationOTP);
router.post("/verify-email", verifyEmailOTP);
router.get("/me", authMiddleware, getMe);

module.exports = router;
