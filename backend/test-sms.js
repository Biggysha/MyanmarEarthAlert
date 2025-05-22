// Test script to send a real SMS using Twilio
require('dotenv').config();
const { sendSMS } = require('./services/smsService');

// Default to the USER_PHONE in .env or use the provided number
const testPhone = process.env.USER_PHONE || '+959793160429'; 

// Test earthquake data
const testEarthquake = {
  magnitude: 5.2,
  location: 'near Yangon, Myanmar',
  time: new Date()
};

// Format the message
const formatAlertMessage = (earthquake) => {
  const { magnitude, location, time } = earthquake;
  const formattedTime = new Date(time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `EARTHQUAKE ALERT: Magnitude ${magnitude.toFixed(1)} earthquake detected ${location} at ${formattedTime}. Take protective measures if you are in the affected area. Stay indoors and away from windows. More info at myanmarearthquakealert.org`;
};

// Send the test SMS
const runTest = async () => {
  console.log('Sending test SMS alert...');
  
  try {
    // Generate the alert message
    const message = formatAlertMessage(testEarthquake);
    
    // Log the test details
    console.log(`Test SMS Details:
    To: ${testPhone}
    Message: ${message}`);
    
    // Send the SMS
    const result = await sendSMS(testPhone, message);
    
    // Log the result
    console.log('SMS sent successfully!');
    console.log(`SMS SID: ${result.sid}`);
    console.log(`Status: ${result.status}`);
    
  } catch (error) {
    console.error('Error sending test SMS:', error);
  }
};

// Run the test
runTest();
