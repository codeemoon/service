const Category = require("../models/category.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Create Category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    let imageUrl = "";
    if (req.file) {
      const uploadResponse = await uploadOnCloudinary(req.file.path, "adminCatogeryUploads");
      if (uploadResponse) {
        imageUrl = uploadResponse.url;
      }
    }

    const category = new Category({ name, image: imageUrl, description });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Categories (Public)
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    console.log("[UpdateCategory] Request body:", req.body); // DEBUG
    console.log("[UpdateCategory] File received:", req.file); // DEBUG

    let updateData = { name, description };

    // If new image uploaded, upload to Cloudinary
    if (req.file) {
      console.log("[UpdateCategory] Uploading to Cloudinary..."); // DEBUG
      const uploadResponse = await uploadOnCloudinary(req.file.path, "adminCatogeryUploads");
      console.log("[UpdateCategory] Cloudinary response:", uploadResponse); // DEBUG
      if (uploadResponse) {
        updateData.image = uploadResponse.url;
      }
    } else {
      console.log("[UpdateCategory] No file in request"); // DEBUG
    }

    console.log("[UpdateCategory] Update data:", updateData); // DEBUG

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("[UpdateCategory] Error:", error); // DEBUG
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
