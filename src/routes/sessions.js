const express = require("express");
const path = require("path");
const authMiddleware = require(path.join(__dirname, "../middlewares/auth"));
const Session = require(path.join(__dirname, "../models/session"));

const router = express.Router();

// ✅ DEBUG LOGGING
console.log("✅ Sessions route loaded");

// @route   GET /api/sessions/test
// @desc    Test sessions route
// @access  Public
router.get("/test", (req, res) => {
    console.log("✅ Sessions route test successful");
    res.json({ message: "Sessions route is active" });
});

// @route   POST /api/sessions/start
// @desc    Start a new session
// @access  Private
router.post("/start", authMiddleware, async (req, res) => {
    console.log("🔹 Start session route hit");

    try {
        const newSession = new Session(req.body);
        await newSession.save();
        res.json(newSession);
    } catch (error) {
        console.error("🚨 Server error:", error.message);
        res.status(500).send("Server error");
    }
});

// ✅ Export Correctly
module.exports = router;
