
const mongoose = require('mongoose');

const WeatherSummarySchema = new mongoose.Schema({
    city: { type: String, required: true },
    date: { type: String, required: true },
    avgTemperature: { type: Number, required: true },
    maxTemperature: { type: Number, required: true },
    minTemperature: { type: Number, required: true },
    dominantCondition: { type: String, required: true },
});

module.exports = mongoose.model('WeatherSummary', WeatherSummarySchema);
