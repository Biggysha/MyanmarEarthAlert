require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cron = require('node-cron');

// Import route handlers
const userRoutes = require('./routes/users');
const alertRoutes = require('./routes/alerts');
const earthquakeRoutes = require('./routes/earthquakes');

// Import services
const { fetchEarthquakeData } = require('./services/earthquakeService');
const { sendAlerts } = require('./services/smsService');

// Initialize Express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: ['https://myanmarearthquakealert.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Parse JSON request body
app.use(morgan('dev')); // Request logging

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myanmar-earthquake-alert', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/earthquakes', earthquakeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Myanmar Earthquake Alert System API' });
});

// Schedule tasks - fetch earthquake data every hour
cron.schedule('0 * * * *', async () => {
  console.log('Fetching earthquake data...');
  try {
    const newEarthquakes = await fetchEarthquakeData();
    if (newEarthquakes && newEarthquakes.length > 0) {
      console.log(`Found ${newEarthquakes.length} new earthquakes`);
      // Send alerts for significant earthquakes
      await sendAlerts(newEarthquakes);
    } else {
      console.log('No new earthquakes detected');
    }
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
