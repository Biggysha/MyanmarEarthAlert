const twilio = require('twilio');
const User = require('../models/User');
const { getEarthquakesForAlerts, markEarthquakesAsProcessed } = require('./earthquakeService');

// Twilio client setup
// Get credentials from environment variables
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send an SMS to a specific phone number
 * @param {string} phone The recipient's phone number
 * @param {string} message The message to send
 * @returns {Promise} The Twilio message object
 */
async function sendSMS(phone, message) {
  try {
    console.log(`Sending SMS to: ${phone}, Message: ${message}`);
    
    // Use Twilio API to send real SMS messages
    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phone
    });
    
    console.log(`SMS sent successfully, SID: ${twilioMessage.sid}`);
    return twilioMessage;
  } catch (error) {
    console.error(`Error sending SMS to ${phone}:`, error);
    throw error;
  }
}

/**
 * Format an earthquake alert message
 * @param {Object} earthquake The earthquake data object
 * @returns {string} Formatted alert message
 */
function formatAlertMessage(earthquake) {
  const { magnitude, location, time } = earthquake;
  const formattedTime = new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `EARTHQUAKE ALERT: Magnitude ${magnitude.toFixed(1)} earthquake detected ${location} at ${formattedTime}. Take protective measures if you are in the affected area. Stay indoors and away from windows. More info at myanmarearthquakealert.org`;
}

/**
 * Send alerts for new earthquakes to all relevant users
 * @param {Array} newEarthquakes Array of new earthquake objects
 * @returns {Object} Results of the alert sending process
 */
async function sendAlerts(newEarthquakes = []) {
  try {
    // If no earthquakes are provided, fetch ones that need processing
    const earthquakes = newEarthquakes.length > 0 
      ? newEarthquakes 
      : await getEarthquakesForAlerts();
    
    if (earthquakes.length === 0) {
      console.log('No new earthquakes to send alerts for');
      return { success: true, alertsSent: 0 };
    }
    
    console.log(`Sending alerts for ${earthquakes.length} earthquakes`);
    
    let totalAlertsSent = 0;
    const results = [];
    
    for (const earthquake of earthquakes) {
      // Skip earthquakes below certain thresholds
      if (earthquake.magnitude < 4.0) continue;
      
      // Format the alert message
      const message = formatAlertMessage(earthquake);
      
      // Determine which users should receive this alert based on earthquake magnitude
      let alertLevelFilter;
      if (earthquake.magnitude >= 6.0) {
        alertLevelFilter = { $in: ['all', 'significant', 'major'] };
      } else if (earthquake.magnitude >= 5.0) {
        alertLevelFilter = { $in: ['all', 'significant'] };
      } else {
        alertLevelFilter = 'all';
      }
      
      // Find users who should receive this alert
      const users = await User.find({ 
        active: true,
        alertLevel: alertLevelFilter
      });
      
      console.log(`Sending alerts to ${users.length} users for M${earthquake.magnitude} earthquake`);
      
      // Send SMS to each user
      for (const user of users) {
        try {
          await sendSMS(user.phone, message);
          totalAlertsSent++;
          
          // Update the last notified time
          user.lastNotified = new Date();
          await user.save();
        } catch (error) {
          console.error(`Failed to send alert to ${user.phone}:`, error);
          results.push({
            earthquake: earthquake._id,
            user: user._id,
            success: false,
            error: error.message
          });
        }
      }
      
      results.push({
        earthquake: earthquake._id,
        userCount: users.length,
        success: true
      });
    }
    
    // Mark earthquakes as processed
    await markEarthquakesAsProcessed(earthquakes);
    
    return {
      success: true,
      alertsSent: totalAlertsSent,
      earthquakeCount: earthquakes.length,
      results
    };
  } catch (error) {
    console.error('Error sending alerts:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendSMS,
  sendAlerts,
  formatAlertMessage
};
