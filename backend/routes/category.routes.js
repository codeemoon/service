const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");

// Public
router.get("/", getAllCategories);

// Admin Only
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createCategory);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
