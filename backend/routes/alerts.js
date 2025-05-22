const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendSMS } = require('../services/smsService');

// @route   POST api/alerts/test
// @desc    Send a test alert to a specific user
// @access  Private (would need auth middleware in production)
router.post(
  '/test',
  [
    check('phone', 'Phone number is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, message } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send test SMS
      const result = await sendSMS(phone, message);
      
      // Update the last notified time
      user.lastNotified = new Date();
      await user.save();

      res.json({ 
        success: true,
        message: 'Test alert sent successfully',
        result
      });
    } catch (err) {
      console.error('Error sending test alert:', err.message);
      res.status(500).json({
        success: false,
        message: 'Failed to send test alert',
        error: err.message
      });
    }
  }
);

// @route   POST api/alerts/broadcast
// @desc    Broadcast an alert to all users or filtered by criteria
// @access  Private (would need auth middleware in production)
router.post(
  '/broadcast',
  [
    check('message', 'Message is required').not().isEmpty(),
    check('minMagnitude', 'Minimum magnitude must be a number').optional().isNumeric(),
    check('city', 'City must be a string').optional().isString()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, minMagnitude, city } = req.body;

    try {
      // Build query for filtering users
      const query = { active: true };
      
      // Filter by city if provided
      if (city) {
        query.city = city;
      }
      
      // Filter by alert level based on magnitude
      if (minMagnitude) {
        if (parseFloat(minMagnitude) >= 6.0) {
          query.alertLevel = { $in: ['all', 'significant', 'major'] };
        } else if (parseFloat(minMagnitude) >= 5.0) {
          query.alertLevel = { $in: ['all', 'significant'] };
        } else {
          query.alertLevel = 'all';
        }
      }
      
      // Find matching users
      const users = await User.find(query);
      
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users match the criteria' });
      }
      
      // Send SMS to each user
      const results = [];
      for (const user of users) {
        try {
          const result = await sendSMS(user.phone, message);
          results.push({ user: user._id, success: true, result });
          
          // Update the last notified time
          user.lastNotified = new Date();
          await user.save();
        } catch (err) {
          results.push({ user: user._id, success: false, error: err.message });
        }
      }
      
      res.json({
        totalUsers: users.length,
        successCount: results.filter(r => r.success).length,
        failureCount: results.filter(r => !r.success).length,
        details: results
      });
    } catch (err) {
      console.error('Error broadcasting alerts:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/alerts/stats
// @desc    Get alert statistics
// @access  Private (would need auth middleware in production)
router.get('/stats', async (req, res) => {
  try {
    // Get total user count
    const totalUsers = await User.countDocuments({ active: true });
    
    // Get users by alert level
    const usersByAlertLevel = await User.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$alertLevel', count: { $sum: 1 } } }
    ]);
    
    // Get users by city
    const usersByCity = await User.aggregate([
      { $match: { active: true } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get recently notified users (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentlyNotified = await User.countDocuments({
      active: true,
      lastNotified: { $gte: yesterday }
    });
    
    res.json({
      totalUsers,
      usersByAlertLevel,
      usersByCity,
      recentlyNotified
    });
  } catch (err) {
    console.error('Error fetching alert stats:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
