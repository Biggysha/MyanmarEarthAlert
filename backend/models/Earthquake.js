const mongoose = require('mongoose');

const EarthquakeSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  magnitude: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    index: '2dsphere'
  },
  depth: {
    type: Number,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  alertLevel: {
    type: String,
    enum: ['green', 'yellow', 'orange', 'red'],
    default: 'green'
  },
  url: {
    type: String
  },
  processed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate alert level based on magnitude
EarthquakeSchema.pre('save', function(next) {
  if (this.magnitude >= 7.0) {
    this.alertLevel = 'red';
  } else if (this.magnitude >= 6.0) {
    this.alertLevel = 'orange';
  } else if (this.magnitude >= 5.0) {
    this.alertLevel = 'yellow';
  } else {
    this.alertLevel = 'green';
  }
  next();
});

// Index for querying by magnitude
EarthquakeSchema.index({ magnitude: 1 });

// Index for querying by time
EarthquakeSchema.index({ time: -1 });

module.exports = mongoose.model('Earthquake', EarthquakeSchema);
