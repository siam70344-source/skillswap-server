const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get freelancers only
router.get('/freelancers', async (req, res) => {
  try {
    const freelancers = await User.find({ role: 'freelancer' });
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update user (upsert)
router.post('/', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body,
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:email', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Block/Unblock user
router.patch('/:email/block', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;