const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Create Admin (run once)
router.post("/setup", async (req, res) => {
  try {
    const existing = await User.findOne({ role: "admin" });
    if (existing) return res.status(400).json({ error: "Admin already exists" });

    const admin = await User.create({
      phone: "0700000000",
      email: process.env.ADMIN_EMAIL || "admin@hotspot.com",
      password: process.env.ADMIN_PASSWORD || "Admin@1234",
      role: "admin",
      name: "Admin",
    });

    res.json({ message: "Admin created successfully", email: admin.email });
  } catch (error) {
    res.status(500).json({ error: "Setup failed" });
  }
});

module.exports = router;
