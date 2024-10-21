
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const WeatherSummary = require('./models/WeatherSummary');
// const UserThreshold = require('./models/UserThreshold'); // Import the UserThreshold model

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// List of cities
const cities = ['Delhi', 'Mumbai', 'Hyderabad', 'Kolkata', 'Chennai','Bangalore'];
const API_KEY = process.env.OPENWEATHER_API_KEY; // Store your OpenWeatherMap API Key in a .env file

// Function to fetch weather data
const fetchWeatherData = async () => {
    for (const city of cities) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            const weatherData = response.data;
            
            // Process and calculate the necessary metrics
            const tempInCelsius = weatherData.main.temp - 273.15; // Convert Kelvin to Celsius
            const feelsLikeInCelsius = weatherData.main.feels_like - 273.15;
            const maxTempInCelsius = weatherData.main.temp_max - 273.15;
            const minTempInCelsius = weatherData.main.temp_min - 273.15;
            const dominantCondition = weatherData.weather[0].main; // Main condition e.g. Rain, Clear
            
            // Get today's date in YYYY-MM-DD format
            const today = new Date();
            const date = today.toISOString().split('T')[0];

            // Save to MongoDB
            await WeatherSummary.findOneAndUpdate(
                { city, date },
                {
                        avgTemperature: tempInCelsius,
                        maxTemperature: maxTempInCelsius,
                        minTemperature: minTempInCelsius,
                        dominantCondition

               
                },
                { upsert: true, new: true }
            );

        } catch (error) {
            console.error(`Error fetching weather data for ${city}:`, error.message);
        }
    }
};

setInterval(()=>{
    fetchWeatherData();
},24*60*60*1000) // Inserted in a Day

// Add this route in your server.js file
app.get('/api/weather-summaries', async (req, res) => {
    try {
        const summaries = await WeatherSummary.find({});
        res.json(summaries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather summaries', error });
    }
});

// Schedule the fetchWeatherData function to run every 5 minutes

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


 