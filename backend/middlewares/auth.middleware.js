const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_123");
    req.user = decoded; // { id: "...", role: "..." }
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

const providerMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === "provider" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied, provider only" });
  }
};

module.exports = { authMiddleware, adminMiddleware, providerMiddleware };
