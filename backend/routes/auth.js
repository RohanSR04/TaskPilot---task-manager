const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
   // Debugging

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("Access Denied: No Token Provided");
    return res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, "tcmTM", (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    req.user = user;
    next();
  });
};

// User Info Route 
router.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Exporting both authenticateToken & router
module.exports = { authenticateToken, authRouter: router };
