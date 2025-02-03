const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    session_id: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    trainer_id: { type: String, required: true },
    boxers: [
        {
            boxer_id: { type: String, required: true },
            station_id: { type: String, required: true },
            status: { type: String, default: "confirmed" }
        }
    ],
    status: { type: String, default: "upcoming" }
});

module.exports = mongoose.model('Session', SessionSchema);
