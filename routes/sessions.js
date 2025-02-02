const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const authMiddleware = require('../middleware/authMiddleware'); // Corrected path

// Start a session
router.post('/start', authMiddleware, async (req, res) => {
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await Session.findOne({ session_id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        session.status = "active";
        await session.save();
        res.json({ message: "Session started successfully", session });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
