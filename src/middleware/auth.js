const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const authMiddleware = require("../middleware/authMiddleware");

// Login Route for Both Boxers & Trainers
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let role = "boxer";

    if (!user) {
      user = await Trainer.findOne({ email });
      role = "trainer";
    }

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role, user });
  } catch (error) {
    console.error("🔥 Login Route Error:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
