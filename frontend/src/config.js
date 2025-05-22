// Configuration settings for the frontend
const config = {
  // API base URL - change this in production to your actual backend URL
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Map settings
  map: {
    defaultCenter: [19.7633, 96.0785], // Myanmar center coordinates
    defaultZoom: 6
  },
  
  // Alert levels
  alertLevels: {
    green: {
      label: 'Green',
      description: 'No significant earthquake activity',
      color: '#91cf60'
    },
    yellow: {
      label: 'Yellow',
      description: 'Moderate earthquake activity (M 5.0-5.9)',
      color: '#fee08b'
    },
    orange: {
      label: 'Orange',
      description: 'Strong earthquake activity (M 6.0-6.9)',
      color: '#fc8d59'
    },
    red: {
      label: 'Red',
      description: 'Major earthquake activity (M 7.0+)',
      color: '#d73027'
    }
  }
};

export default config;
