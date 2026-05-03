const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "pulse-secret-key-2026";

// Login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  if (!['admin', 'staff'].includes(user.role)) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: '8h' });

  res.json({
    success: true,
    token,
    user: { name: user.name, role: user.role, phone: user.phone }
  });
});

module.exports = router;
