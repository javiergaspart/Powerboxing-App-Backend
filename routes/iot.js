const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// @route   POST /api/iot/start-session
// @desc    Start a boxing session (Triggers IoT & Video)
router.post('/start-session', auth, async (req, res) => {
    try {
        const response = await axios.post(process.env.IOT_API_URL, {
            action: "start",
            secret: process.env.IOT_SECRET_KEY
        });

        res.json({ message: "Session started successfully", data: response.data });
    } catch (err) {
        res.status(500).json({ message: "Failed to start session" });
    }
});

module.exports = router;
