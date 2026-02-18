const express = require("express");
const router = express.Router();
const { deleteAccount } = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.delete("/me", authMiddleware, deleteAccount);

module.exports = router;
