# Myanmar Earthquake Alert System - Installation Guide

This guide will help you set up and run the Myanmar Earthquake Alert System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)

## Setup Instructions

### 1. Clone the Repository

If you haven't already cloned the repository, do so with:

```bash
git clone <repository-url>
cd myanmar-earthquake-alert
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
# Particularly for Twilio SMS credentials if you want to send real SMS alerts
```

#### Start the Backend Server

```bash
# Start the server in development mode
npm run dev

# Or for production
npm start
```

The backend server will start on `http://localhost:5000`.

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Start the Frontend Development Server

```bash
npm start
```

The frontend development server will start on `http://localhost:3000`.

## Testing the System

1. Open your browser and go to `http://localhost:3000`
2. Navigate to the "Register for Alerts" page to add phone numbers for SMS alerts
3. View earthquake news and educational content

## API Endpoints

The backend provides the following API endpoints:

### Users API
- `POST /api/users` - Register a new user for alerts
- `GET /api/users` - Get all registered users (admin only)
- `DELETE /api/users/:phone` - Unsubscribe a user

### Earthquakes API
- `GET /api/earthquakes` - Get earthquake data with filtering options
- `GET /api/earthquakes/:id` - Get details of a specific earthquake
- `GET /api/earthquakes/region/:city` - Get earthquakes near a specific city
- `GET /api/earthquakes/stats/recent` - Get statistics about recent earthquake activity

### Alerts API
- `POST /api/alerts/test` - Send a test alert to a specific user
- `POST /api/alerts/broadcast` - Broadcast an alert to all users or filtered by criteria
- `GET /api/alerts/stats` - Get alert statistics

## SMS Service

The system uses Twilio for sending SMS alerts. In development mode, messages are logged to the console rather than actually sent. To enable real SMS sending:

1. Sign up for a Twilio account at https://www.twilio.com/
2. Get your Account SID, Auth Token, and a Twilio phone number
3. Add these credentials to your `.env` file
4. Uncomment the Twilio client initialization in `backend/services/smsService.js`

## Earthquake Data

The system fetches earthquake data from the USGS Earthquake API. By default, it filters for earthquakes in and around Myanmar with a magnitude of 3.0 or greater.

## Scheduled Tasks

The backend uses node-cron to schedule tasks:
- Fetch new earthquake data hourly
- Process and send alerts for significant earthquakes
