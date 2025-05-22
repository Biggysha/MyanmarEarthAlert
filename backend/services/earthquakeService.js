const axios = require('axios');
const Earthquake = require('../models/Earthquake');

/**
 * Fetch earthquake data from the USGS API
 * This service filters for earthquakes in and around Myanmar
 */
async function fetchEarthquakeData() {
  try {
    // Define the Myanmar region bounding box
    // Approximately covers Myanmar and surrounding areas
    // Format: [min_longitude, min_latitude, max_longitude, max_latitude]
    const myanmarBoundingBox = "91.0,9.0,102.0,29.0";
    
    // USGS Earthquake API endpoint for the last 7 days
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${getLastWeek()}&minmagnitude=3.0&bbox=${myanmarBoundingBox}`;
    
    const response = await axios.get(url);
    const earthquakeData = response.data;
    
    if (!earthquakeData || !earthquakeData.features) {
      console.error('Invalid data format from USGS API');
      return [];
    }
    
    // Process and save new earthquakes
    const newEarthquakes = [];
    
    for (const feature of earthquakeData.features) {
      // Extract data from USGS format
      const {
        id,
        properties: { 
          mag, 
          place, 
          time,
          url,
          title
        },
        geometry: { coordinates }
      } = feature;
      
      // Check if this earthquake is already in our database
      const existingEarthquake = await Earthquake.findOne({ eventId: id });
      
      if (!existingEarthquake) {
        // Create new earthquake record
        const newEarthquake = new Earthquake({
          eventId: id,
          title: title || `M ${mag} - ${place}`,
          magnitude: mag,
          location: place,
          coordinates: [coordinates[0], coordinates[1]], // [longitude, latitude]
          depth: coordinates[2],
          time: new Date(time),
          url: url
        });
        
        await newEarthquake.save();
        newEarthquakes.push(newEarthquake);
      }
    }
    
    return newEarthquakes;
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    throw error;
  }
}

/**
 * Get a date string for last week in ISO format
 */
function getLastWeek() {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  return lastWeek.toISOString().split('T')[0];
}

/**
 * Filter earthquakes that are relevant for alerting based on magnitude and recency
 */
async function getEarthquakesForAlerts(minMagnitude = 4.0, maxHoursOld = 2) {
  try {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - maxHoursOld);
    
    return await Earthquake.find({
      magnitude: { $gte: minMagnitude },
      time: { $gte: cutoffTime },
      processed: false
    }).sort({ magnitude: -1 });
  } catch (error) {
    console.error('Error getting earthquakes for alerts:', error);
    throw error;
  }
}

/**
 * Mark earthquakes as processed after sending alerts
 */
async function markEarthquakesAsProcessed(earthquakes) {
  try {
    const ids = earthquakes.map(eq => eq._id);
    await Earthquake.updateMany(
      { _id: { $in: ids } },
      { $set: { processed: true } }
    );
  } catch (error) {
    console.error('Error marking earthquakes as processed:', error);
    throw error;
  }
}

/**
 * Get significant earthquakes in the last 24 hours
 */
async function getRecentSignificantEarthquakes() {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return await Earthquake.find({
      time: { $gte: oneDayAgo },
      magnitude: { $gte: 4.0 }
    }).sort({ time: -1 });
  } catch (error) {
    console.error('Error getting recent significant earthquakes:', error);
    throw error;
  }
}

module.exports = {
  fetchEarthquakeData,
  getEarthquakesForAlerts,
  markEarthquakesAsProcessed,
  getRecentSignificantEarthquakes
};
