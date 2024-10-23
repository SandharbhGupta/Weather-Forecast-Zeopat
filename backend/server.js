const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const WeatherSummary = require('./models/WeatherSummary');
const UserThreshold = require('./models/UserThreshold');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Function to fetch and process weather data
const fetchWeatherData = async () => {
    const cities = ['Delhi', 'Mumbai', 'Hyderabad', 'Kolkata', 'Chennai', 'Bangalore'];
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    for (const city of cities) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            const weatherData = response.data;
            const tempInCelsius = weatherData.main.temp - 273.15;

            console.log(`Fetched data for ${city}: ${tempInCelsius.toFixed(2)}°C`);

            // Retrieve user thresholds for the city
            const userThresholds = await UserThreshold.find({ city });

            // Evaluate thresholds for each user
            userThresholds.forEach(async (threshold) => {
                if (tempInCelsius >= threshold.temperatureThreshold) {
                    threshold.currentConsecutiveBreaches += 1;

                    if (threshold.currentConsecutiveBreaches >= threshold.consecutiveUpdates) {
                        // Log the alert condition on the server
                        console.log(`Alert for ${city}: User ${threshold.userId} - Temperature has exceeded ${threshold.temperatureThreshold}°C for ${threshold.consecutiveUpdates} consecutive updates. Current temperature: ${tempInCelsius.toFixed(2)}°C.`);

                        // Reset breach count after alerting
                        threshold.currentConsecutiveBreaches = 0;
                    }
                } else {
                    // Reset consecutive breach count if temperature is below the threshold
                    threshold.currentConsecutiveBreaches = 0;
                }

                // Save the updated threshold to the database
                await threshold.save();
            });

        } catch (error) {
            console.error(`Error fetching weather data for ${city}:`, error.message);
        }
    }
};

// Schedule weather data fetching every 5 minutes (300000 milliseconds)
setInterval(fetchWeatherData, 300000); // 5 minutes

// API to get alerts for the user (simplified)
app.get('/api/alerts', async (req, res) => {
    try {
        const userId = req.query.userId; // Assuming userId is passed as a query parameter

        // Retrieve all alerts for the user
        const alerts = await UserThreshold.find({ userId, currentConsecutiveBreaches: { $gt: 0 } });

        res.json(alerts.map(alert => ({
            city: alert.city,
            message: `Temperature has exceeded ${alert.temperatureThreshold}°C for ${alert.consecutiveUpdates} consecutive updates.`,
        })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
