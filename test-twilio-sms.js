// Direct test script for sending SMS with Twilio
const twilio = require('twilio');

// Twilio credentials - replace with your own before using
const TWILIO_ACCOUNT_SID = 'your_twilio_account_sid';
const TWILIO_AUTH_TOKEN = 'your_twilio_auth_token';
const TWILIO_PHONE_NUMBER = 'your_twilio_phone_number';
const USER_PHONE = 'your_phone_number'; // Your phone number

// Create Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

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

// Send a real SMS message
async function sendTestSMS() {
  console.log(`Preparing to send SMS to ${USER_PHONE}...`);
  
  // Create the message
  const message = formatAlertMessage(testEarthquake);
  console.log(`Message: ${message}`);
  
  try {
    // Send the SMS using Twilio
    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: USER_PHONE
    });
    
    console.log('SMS sent successfully!');
    console.log(`SMS SID: ${result.sid}`);
    console.log(`Status: ${result.status}`);
    
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

// Run the test
sendTestSMS();
