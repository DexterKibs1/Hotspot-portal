const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

// Get all active packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ price: 1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

// Seed default packages (run once)
router.post("/seed", async (req, res) => {
  try {
    await Package.deleteMany({});
    const packages = await Package.insertMany([
      { name: "1 Hour", price: 10, duration: 60, speed: "5 Mbps", description: "Perfect for quick browsing", popular: false },
      { name: "3 Hours", price: 20, duration: 180, speed: "10 Mbps", description: "Great for work sessions", popular: false },
      { name: "Daily", price: 50, duration: 1440, speed: "10 Mbps", description: "Full day unlimited access", popular: true },
      { name: "Weekly", price: 200, duration: 10080, speed: "20 Mbps", description: "Best value for the week", popular: false },
      { name: "Monthly", price: 500, duration: 43200, speed: "20 Mbps", description: "Ultimate monthly plan", popular: false },
    ]);
    res.json({ message: "Packages seeded!", packages });
  } catch (error) {
    res.status(500).json({ error: "Seeding failed" });
  }
});

module.exports = router;
