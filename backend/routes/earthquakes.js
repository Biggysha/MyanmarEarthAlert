const express = require('express');
const router = express.Router();
const Earthquake = require('../models/Earthquake');

// @route   GET api/earthquakes
// @desc    Get all earthquakes with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      minMagnitude = 0, 
      maxMagnitude = 10, 
      startDate, 
      endDate, 
      limit = 10, 
      page = 1 
    } = req.query;
    
    // Build query
    const query = {
      magnitude: { $gte: parseFloat(minMagnitude), $lte: parseFloat(maxMagnitude) }
    };
    
    // Add date filter if provided
    if (startDate || endDate) {
      query.time = {};
      if (startDate) query.time.$gte = new Date(startDate);
      if (endDate) query.time.$lte = new Date(endDate);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const earthquakes = await Earthquake.find(query)
      .sort({ time: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Earthquake.countDocuments(query);
    
    res.json({
      data: earthquakes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching earthquakes:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/earthquakes/:id
// @desc    Get earthquake by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const earthquake = await Earthquake.findOne({ 
      $or: [
        { _id: req.params.id }, 
        { eventId: req.params.id }
      ]
    });
    
    if (!earthquake) {
      return res.status(404).json({ message: 'Earthquake not found' });
    }
    
    res.json(earthquake);
  } catch (err) {
    console.error('Error fetching earthquake:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Earthquake not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/earthquakes/region/:city
// @desc    Get earthquakes near a specific city/region
// @access  Public
router.get('/region/:city', async (req, res) => {
  try {
    // In a real app, we would have a geocoding service to convert city names to coordinates
    // For simplicity, we're using a mock implementation
    const cityCoordinates = getCityCoordinates(req.params.city);
    
    if (!cityCoordinates) {
      return res.status(400).json({ message: 'City not recognized' });
    }
    
    // Find earthquakes within ~200km of the city
    const earthquakes = await Earthquake.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [cityCoordinates.lng, cityCoordinates.lat]
          },
          $maxDistance: 200000 // 200km in meters
        }
      }
    }).sort({ time: -1 }).limit(10);
    
    res.json(earthquakes);
  } catch (err) {
    console.error('Error fetching regional earthquakes:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/earthquakes/stats/recent
// @desc    Get statistics about recent earthquake activity
// @access  Public
router.get('/stats/recent', async (req, res) => {
  try {
    // Last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Count by magnitude range
    const stats = await Earthquake.aggregate([
      { $match: { time: { $gte: thirtyDaysAgo } } },
      { $group: {
          _id: {
            $cond: [
              { $gte: ['$magnitude', 6.0] }, 'major',
              { $cond: [{ $gte: ['$magnitude', 5.0] }, 'moderate', 'minor'] }
            ]
          },
          count: { $sum: 1 },
          avgMagnitude: { $avg: '$magnitude' }
        }
      }
    ]);
    
    // Get the largest recent earthquake
    const largest = await Earthquake.findOne({
      time: { $gte: thirtyDaysAgo }
    }).sort({ magnitude: -1 });
    
    // Get the most recent earthquake
    const mostRecent = await Earthquake.findOne().sort({ time: -1 });
    
    res.json({
      byCategory: stats,
      largest,
      mostRecent,
      totalLast30Days: await Earthquake.countDocuments({ time: { $gte: thirtyDaysAgo } })
    });
  } catch (err) {
    console.error('Error fetching earthquake stats:', err.message);
    res.status(500).send('Server error');
  }
});

// Helper function to mock geocoding
function getCityCoordinates(city) {
  const cityMap = {
    'yangon': { lat: 16.8661, lng: 96.1951 },
    'mandalay': { lat: 21.9745, lng: 96.0836 },
    'naypyidaw': { lat: 19.7633, lng: 96.0785 },
    'bago': { lat: 17.3350, lng: 96.4821 },
    'mawlamyine': { lat: 16.4899, lng: 97.6260 },
    'taunggyi': { lat: 20.7892, lng: 97.0378 },
    'pathein': { lat: 16.7792, lng: 94.7320 },
    'sittwe': { lat: 20.1450, lng: 92.8681 },
    'myitkyina': { lat: 25.3842, lng: 97.3963 },
    'dawei': { lat: 14.0823, lng: 98.1941 }
  };
  
  return cityMap[city.toLowerCase()] || null;
}

module.exports = router;
