
const mongoose = require('mongoose');

const UserThresholdSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Assume users are identified by a unique userId
    temperatureThreshold: { type: Number, default: 35 }, // Default threshold
    condition: { type: String, default: 'Clear' }, // Default condition
    consecutiveUpdates: { type: Number, default: 2 }, // Number of consecutive updates to trigger an alert
});

module.exports = mongoose.model('UserThreshold', UserThresholdSchema);
