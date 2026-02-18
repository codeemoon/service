const express = require("express");
const router = express.Router();
const { addReview, getServiceReviews } = require("../controllers/review.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Public: Get reviews for a service
router.get("/:serviceId", getServiceReviews);

// Protected: Add review
router.post("/", authMiddleware, addReview);

module.exports = router;
