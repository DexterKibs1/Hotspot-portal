const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// ======================
// Dashboard Stats
// ======================
router.get('/stats', async (req, res) => {
  try {
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const todayRevenue = await Transaction.aggregate([
      { $match: { status: 'completed', completedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        totalTransactions: await Transaction.countDocuments({ status: 'completed' }),
        totalUsers: await User.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================
// Packages Management
// ======================

// Get all packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find().sort({ sortOrder: 1, price: 1 });
    res.json({ success: true, packages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch packages' });
  }
});

// Create new package
router.post('/packages', async (req, res) => {
  try {
    const pkg = new Package(req.body);
    await pkg.save();
    res.json({ success: true, package: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update package
router.put('/packages/:id', async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, package: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete package
router.delete('/packages/:id', async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Seed default packages
router.post('/seed', async (req, res) => {
  // ... (same as before)
});

module.exports = router;
