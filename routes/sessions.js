const express = require("express");
const path = require("path");
const router = express.Router();
const authMiddleware = require(path.join(__dirname, "../middlewares/auth"));
const Session = require(path.join(__dirname, "../models/session")); // FIXED PATH

// Start Session Route
router.post("/start", authMiddleware, async (req, res) => {
  try {
    const { session_id } = req.body;
    const session = await Session.findOneAndUpdate(
      { session_id },
      { $set: { status: "active" } },
      { new: true }
    );

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.json({ message: "Session started", session });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
