
const express = require('express');
const axios = require('axios');
const Weather = require('../models/weather');
const router = express.Router();

// Fetch weather data for a specific city
router.get('/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        const response = await axios.get(url);
        const { temp } = response.data.main;
        const description = response.data.weather[0].description;

        // Save to the database
        const weatherData = new Weather({
            city,
            temperature: temp,
            description,
        });

        await weatherData.save();

        res.json({
            city,
            temperature: temp,
            description,
            message: 'Weather data fetched and saved successfully',
        });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
