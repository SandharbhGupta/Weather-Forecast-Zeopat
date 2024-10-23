
// const mongoose = require('mongoose');

// const UserThresholdSchema = new mongoose.Schema({
//     userId: { type: String, required: true }, // Assume users are identified by a unique userId
//     temperatureThreshold: { type: Number, default: 35 }, // Default threshold
//     condition: { type: String, default: 'Clear' }, // Default condition
//     consecutiveUpdates: { type: Number, default: 2 }, // Number of consecutive updates to trigger an alert
// });

// module.exports = mongoose.model('UserThreshold', UserThresholdSchema);

const mongoose = require('mongoose');

const UserThresholdSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Identifier for the user (could be email)
    city: { type: String, required: true }, // The city for which the threshold is set
    temperatureThreshold: { type: Number, default: 35 }, // Threshold temperature in Celsius
    consecutiveUpdates: { type: Number, default: 1 }, // Number of consecutive updates required to trigger alert
    currentConsecutiveBreaches: { type: Number, default: 0 }, // Tracks current consecutive breaches
    condition: { type: String, required: true }, 
});

module.exports = mongoose.model('UserThreshold', UserThresholdSchema);

