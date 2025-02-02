const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Start a session
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

// ✅ Get all sessions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const sessions = await Session.find();
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Get a single session by ID
router.get('/:session_id', authMiddleware, async (req, res) => {
    try {
        const session = await Session.findOne({ session_id: req.params.session_id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Update a session
router.put('/:session_id', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const session = await Session.findOneAndUpdate(
            { session_id: req.params.session_id },
            { status },
            { new: true }
        );
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json({ message: "Session updated successfully", session });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Delete a session
router.delete('/:session_id', authMiddleware, async (req, res) => {
    try {
        const session = await Session.findOneAndDelete({ session_id: req.params.session_id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
