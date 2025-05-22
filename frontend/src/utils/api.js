import axios from 'axios';
import config from '../config';

// Create an axios instance with default config
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API functions for users/alert registration
export const userApi = {
  // Register a new user for alerts
  register: async (userData) => {
    try {
      const res = await api.post('/users', userData);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Unsubscribe a user from alerts
  unsubscribe: async (phone) => {
    try {
      const res = await api.delete(`/users/${phone}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// API functions for earthquakes
export const earthquakeApi = {
  // Get recent earthquakes with optional filters
  getEarthquakes: async (params = {}) => {
    try {
      const res = await api.get('/earthquakes', { params });
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Get a specific earthquake by ID
  getEarthquake: async (id) => {
    try {
      const res = await api.get(`/earthquakes/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Get earthquakes near a city/region
  getRegionalEarthquakes: async (city) => {
    try {
      const res = await api.get(`/earthquakes/region/${city}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  // Get earthquake statistics
  getStatistics: async () => {
    try {
      const res = await api.get('/earthquakes/stats/recent');
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// API functions for news (in a real app, this would connect to the backend)
// For demo purposes, we'll just return mock data
export const newsApi = {
  getNews: async () => {
    try {
      // In a real app, this would be:
      // const res = await api.get('/news');
      // return res.data;
      
      // For demo, return mock data after a slight delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        data: [
          {
            id: 1,
            title: "Magnitude 5.2 Earthquake Hits Near Mandalay",
            content: "A moderate earthquake with a magnitude of 5.2 struck 25 kilometers northeast of Mandalay early Wednesday morning. According to the Myanmar Department of Meteorology and Hydrology, the earthquake occurred at 14:30 local time at a depth of 10 kilometers. There have been no immediate reports of damage or injuries.",
            source: "Myanmar Times",
            date: "2025-05-20",
            category: "recent",
            image: "https://via.placeholder.com/800x450?text=Mandalay+Earthquake"
          },
          {
            id: 2,
            title: "Myanmar Upgrades National Seismic Monitoring Network",
            content: "The Department of Meteorology and Hydrology announced yesterday the completion of a major upgrade to the country's seismic monitoring network. The project, funded by international partners, includes the installation of 15 new state-of-the-art seismic stations across the country, significantly improving Myanmar's ability to detect and analyze earthquakes.",
            source: "Myanmar National News",
            date: "2025-05-15",
            category: "updates",
            image: "https://via.placeholder.com/800x450?text=Seismic+Monitoring+Upgrade"
          },
          {
            id: 3,
            title: "Scientists Warn of Increased Seismic Activity Along Sagaing Fault",
            content: "A team of international geologists has published research indicating an increased probability of seismic activity along Myanmar's Sagaing Fault in the coming years. The study, published in the Journal of Seismology, analyzed patterns of strain accumulation along the fault line and suggests a higher than normal risk for earthquakes of magnitude 6.0 or greater.",
            source: "Science Daily",
            date: "2025-05-10",
            category: "warning",
            image: "https://via.placeholder.com/800x450?text=Sagaing+Fault+Warning"
          },
          {
            id: 4,
            title: "Government Conducts Earthquake Preparedness Drills in Yangon Schools",
            content: "The Myanmar Disaster Management Department conducted earthquake preparedness drills in 50 schools across Yangon this week. The initiative aims to educate students and teachers on proper safety protocols during seismic events. Officials emphasized the importance of regular drills, especially in a country with significant earthquake risk.",
            source: "Yangon Daily",
            date: "2025-05-08",
            category: "education",
            image: "https://via.placeholder.com/800x450?text=School+Earthquake+Drills"
          },
          {
            id: 5,
            title: "Minor Earthquake Shakes Bago Region",
            content: "A minor earthquake with a magnitude of 3.8 was recorded in the Bago Region on Tuesday evening. The epicenter was located approximately 30 kilometers southeast of Bago city. Residents reported feeling light shaking, but no damage or injuries have been reported.",
            source: "Myanmar News Network",
            date: "2025-05-18",
            category: "recent",
            image: "https://via.placeholder.com/800x450?text=Bago+Earthquake"
          }
        ]
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;
