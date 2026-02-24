const Provider = require("../models/provider.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerProvider = async (req, res) => {
  try {
    const { name, email, password, phone, city, area, zipCode, businessName, panNumber, gstNumber, plan } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const existing = await Provider.findOne({ email });
    if (existing) return res.status(400).json({ message: "A provider with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const provider = new Provider({
      name: name || email.split("@")[0], email, password: hashedPassword,
      phone, city, area, zipCode, businessName, panNumber, gstNumber,
      plan: plan || "free", isVerified: true,
    });
    await provider.save();
    res.status(201).json({ message: "Provider registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    let provider = await Provider.findOne({ email });

    // Auto-create test provider for demo/reviewer access
    if (!provider && email === "provider@test.com" && password === "password123") {
      const hashedPassword = await bcrypt.hash(password, 10);
      provider = new Provider({
        name: "Test Provider", email: "provider@test.com", password: hashedPassword,
        phone: "1234567890", city: "Test City", area: "Test Area", zipCode: "12345",
        businessName: "Test Business", panNumber: "ABCDE1234F", gstNumber: "22AAAAA0000A1Z5",
        isVerified: true, plan: "premium",
      });
      await provider.save();
    }

    if (!provider) return res.status(400).json({ message: "Invalid credentials" });
    if (!provider.isVerified) return res.status(401).json({ message: "Please verify your email before logging in.", isVerified: false });

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: provider._id, role: "provider", type: "provider" },
      process.env.JWT_SECRET || "secret_key_123",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful", token,
      user: {
        id: provider._id, name: provider.name, email: provider.email,
        role: "provider", city: provider.city, area: provider.area,
        zipCode: provider.zipCode, businessName: provider.businessName,
        plan: provider.plan, walletBalance: provider.walletBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user.id).select("-password");
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProviderProfile = async (req, res) => {
  try {
    const allowed = ["name", "phone", "city", "area", "zipCode", "businessName", "panNumber", "gstNumber", "plan", "image"];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const provider = await Provider.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true }).select("-password");
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Profile updated", provider });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const checkProviderEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Provider.findOne({ email });
    if (existing) return res.status(400).json({ exists: true, message: "A provider with this email already exists" });
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerProvider, loginProvider, getProviderProfile, updateProviderProfile, checkProviderEmail };
