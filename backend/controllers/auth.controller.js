const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, city, district, zipCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      phone,
      city,
      district,
      zipCode,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret_key_123", // Fallback for dev if env missing
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        district: user.district,
        zipCode: user.zipCode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Needs to be added to backend .env or hardcoded for now if needed

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "130313694816-52bjvisck55q7407h077ivpm6j98o58t.apps.googleusercontent.com", // Client ID from frontend
    });
    const { name, email, picture } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
        // Create new user if not exists
        // Parse name to get district/city? No, we can't get that from Google.
        // They will be "Customer" by default.
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: "customer",
            image: picture
        });
        await user.save();
    }

    // Generate Token
    const jwtToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "secret_key_123",
        { expiresIn: "1d" }
    );

    res.status(200).json({
        message: "Google Login successful",
        token: jwtToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            city: user.city,
            district: user.district,
            zipCode: user.zipCode,
        },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({ message: "Google Login Failed", error: error.message });
  }
};

module.exports = { register, login, getMe, googleLogin };
