
const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    city: { type: String, required: true },
    temperature: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('weather', weatherSchema);

 