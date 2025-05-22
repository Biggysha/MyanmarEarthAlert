# Myanmar Earthquake Alert System

A web-based earthquake alert system for Myanmar that provides:

- Real-time earthquake alerts via SMS
- Current earthquake news and information
- Educational resources about earthquakes and safety

## Project Structure

- `frontend/`: React-based frontend application
- `backend/`: Node.js/Express backend server
- `public/`: Static assets like images and fonts

## Features

- User registration for SMS alerts
- Real-time earthquake data visualization
- Educational content about earthquake preparedness
- News feed of recent seismic activity in Myanmar

## Technologies Used

- Frontend: React, Bootstrap
- Backend: Node.js, Express
- Database: MongoDB
- SMS Service: Twilio API
- Earthquake Data: USGS Earthquake API

1.Frontend (React)
Modern UI with Bootstrap styling
Four main pages: Home, News, Education, and Alert Registration
Interactive earthquake map visualization
Mobile-responsive design
2.Backend (Node.js/Express)
RESTful API structure
MongoDB integration for data storage
Twilio integration for SMS alerts
USGS Earthquake API integration for real-time data
3.Key Features
SMS alert registration for Myanmar residents
Earthquake visualization on interactive maps
Educational resources about earthquake safety
News section for recent seismic activity
Alert filtering based on magnitude preferences

## MongoDB Database
The application uses MongoDB Atlas for database storage. The connection string should be stored in environment variables, not directly in the code.