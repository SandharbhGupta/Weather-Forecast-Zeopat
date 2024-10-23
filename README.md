### Project Overview

This project is a Real-Time Data Processing System for monitoring weather conditions across metro cities in India. It fetches weather data from the OpenWeatherMap API at regular intervals and calculates daily aggregates like average temperature, maximum temperature, minimum temperature, and the dominant weather condition. The system also supports user-configurable alert thresholds, which can trigger notifications when conditions are met.

## Bonus:
● Extended the system to support additional weather parameters from the OpenWeatherMap
API (e.g., humidity, wind speed) and incorporate them into rollups/aggregates.
### Installation and Setup

  ## 1. Clone the Repository
        git clone https://github.com/yourusername/weather-monitoring-system.git
        cd weather-monitoring-system
  ## 2. Setting Up the Backend
      Navigate to the backend folder and install dependencies:
          cd backend
          npm install
      Create a .env file in the backend folder and add your configuration:
          PORT=5000
          (MONGO_URI=your_mongodb_connection_string
          OPENWEATHERMAP_API_KEY=your_api_key)
          or
          I have added these both in my file.
      Start the backend server:
          nodemon server.js
  ## 3. Setting Up the Frontend
      Navigate to the frontend folder and install dependencies:
          cd ../ui
          npm install
      Start the frontend development server:
          npm run dev
  Access the Application: Open your browser and navigate to http://localhost:3000

