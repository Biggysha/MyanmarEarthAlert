const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user for alerts
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, city, alertLevel } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: 'User already registered with this phone number' });
    }
    
    // Create new user
    user = new User({
      name,
      phone,
      email,
      city,
      alertLevel,
      active: true
    });
    
    await user.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Registration successful! You will now receive earthquake alerts.',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

      await user.save();

      res.status(201).json({ 
        message: 'User registered successfully', 
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          city: user.city,
          alertLevel: user.alertLevel
        } 
      });
    } catch (err) {
      console.error('Error registering user:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/users
// @desc    Get all users (admin only in real app)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/:phone
// @desc    Unsubscribe a user by phone number
// @access  Public
router.delete('/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    
    // Find the user by phone number
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Set user as inactive instead of deleting
    user.active = false;
    await user.save();
    
    res.json({ message: 'User unsubscribed successfully' });
  } catch (err) {
    console.error('Error unsubscribing user:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
