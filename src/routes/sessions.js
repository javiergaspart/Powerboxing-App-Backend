const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ SESSION START Route (Protected)
router.post("/start", authMiddleware, async (req, res) => {
    try {
        console.log("🔹 Start session request received by:", req.user.id);

        // Placeholder logic - replace with session handling logic
        res.status(200).json({ message: "Session started successfully" });

    } catch (err) {
        console.error("🚨 Session Start Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
