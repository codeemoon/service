const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, createPlanOrder } = require("../controllers/payment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Create Order (Requires Login)
router.post("/pay", authMiddleware, createOrder);

// Verify Payment (Public callback or Client call)
// Cashfree calls return_url which might be GET, or frontend calls this
router.get("/verify", verifyPayment);

// Plan Payment (Public, during registration)
router.post("/plan-pay", createPlanOrder);

module.exports = router;
