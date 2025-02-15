const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Trainer' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Session', sessionSchema);
