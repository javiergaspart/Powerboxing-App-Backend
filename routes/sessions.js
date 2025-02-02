const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const Session = require('../models/session');
const User = require('../models/User');

// ============================
// 📌 1️⃣ Boxer Books a Session
// ============================
// @route   POST /api/sessions/book
// @desc    Boxer books a session
// @access  Private (Only boxers)
router.post('/book', auth, async (req, res) => {
    try {
        const { session_id } = req.body;
        const user = await User.findById(req.user.id);

        if (user.role !== "boxer") {
            return res.status(403).json({ message: "Only boxers can book sessions" });
        }

        if (user.session_balance <= 0) {
            return res.status(400).json({ message: "Insufficient session balance" });
        }

        const session = await Session.findOne({ session_id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Check if the boxer is already in the session
        const isBoxerInSession = session.boxers.some(b => b.boxer_id.toString() === user.id);
        if (isBoxerInSession) {
            return res.status(400).json({ message: "Boxer is already booked in this session" });
        }

        // Add boxer to session
        session.boxers.push({ boxer_id: user.id, station_id: null, status: "pending" });
        await session.save();

        // Deduct session balance
        user.session_balance -= 1;
        await user.save();

        res.json({ message: "Session booked successfully", session });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ============================
// 📌 2️⃣ Trainer Assigns Boxers to Stations
// ============================
// @route   PUT /api/sessions/assign
// @desc    Trainer assigns boxers to stations
// @access  Private (Only trainers)
router.put('/assign', auth, async (req, res) => {
    try {
        const { session_id, boxer_id, station_id } = req.body;
        const trainer = await User.findById(req.user.id);

        if (trainer.role !== "trainer") {
            return res.status(403).json({ message: "Only trainers can assign boxers" });
        }

        const session = await Session.findOne({ session_id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const boxer = session.boxers.find(b => b.boxer_id.toString() === boxer_id);
        if (!boxer) {
            return res.status(404).json({ message: "Boxer not found in this session" });
        }

        boxer.station_id = station_id;
        boxer.status = "assigned";
        await session.save();

        res.json({ message: "Boxer assigned to station successfully", session });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ============================
// 📌 3️⃣ Trainer Starts the Session (Triggers IoT & Video)
// ============================
// @route   POST /api/sessions/start
// @desc    Trainer starts session (triggers IoT & video)
// @access  Private (Only trainers)
router.post('/start', auth, async (req, res) => {
    try {
        const { session_id } = req.body;
        const trainer = await User.findById(req.user.id);

        if (trainer.role !== "trainer") {
            return res.status(403).json({ message: "Only trainers can start sessions" });
        }

        const session = await Session.findOne({ session_id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Check if all boxers are assigned
        const unassignedBoxers = session.boxers.filter(b => !b.station_id);
        if (unassignedBoxers.length > 0) {
            return res.status(400).json({ message: "All boxers must be assigned before starting the session" });
        }

        // Update session status to "active"
        session.status = "active";
        await session.save();

        // 🔹 Trigger IoT System & Video
        const iotResponse = await axios.post(process.env.IOT_API_URL, {
            action: "start",
            secret: process.env.IOT_SECRET_KEY
        });

        res.json({ message: "Session started successfully", session, iot_response: iotResponse.data });
    } catch (err) {
        res.status(500).json({ message: "Failed to start session", error: err.message });
    }
});

// ============================
// 📌 4️⃣ Get All Sessions (Admin/Trainer)
// ============================
// @route   GET /api/sessions
// @desc    Get all sessions
// @access  Private (Trainers & Admin)
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== "trainer" && user.role !== "admin") {
            return res.status(403).json({ message: "Only trainers or admin can view all sessions" });
        }

        const sessions = await Session.find();
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ============================
// 📌 5️⃣ Get Session Details
// ============================
// @route   GET /api/sessions/:session_id
// @desc    Get session details by ID
// @access  Private
router.get('/:session_id', auth, async (req, res) => {
    try {
        const session = await Session.findOne({ session_id: req.params.session_id });
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json(session);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
