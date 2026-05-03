const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Package = require("../models/Package");

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Dashboard Stats
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const [totalRevenue, totalTransactions, activeUsers, packages] = await Promise.all([
      Transaction.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Transaction.countDocuments({ status: "completed" }),
      User.countDocuments({ isActive: true, sessionExpiry: { $gt: new Date() } }),
      Package.find({ isActive: true }),
    ]);

    const recentTransactions = await Transaction.find({ status: "completed" })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalTransactions,
      activeUsers,
      packages,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Manage Packages
router.post("/packages", authMiddleware, async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: "Failed to create package" });
  }
});

router.put("/packages/:id", authMiddleware, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: "Failed to update package" });
  }
});

router.delete("/packages/:id", authMiddleware, async (req, res) => {
  try {
    await Package.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Package deactivated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete package" });
  }
});

module.exports = router;
