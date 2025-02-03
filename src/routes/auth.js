const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();

const router = express.Router();

// ✅ DEBUG LOGGING
console.log("✅ Auth route loaded");

// @route   GET /api/auth/test
// @desc    Test auth route
// @access  Public
router.get("/test", (req, res) => {
    console.log("✅ Auth route test successful");
    res.json({ message: "Auth route is active" });
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
    console.log("🔹 Login route hit");

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log("❌ Invalid email");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
            if (err) throw err;
            console.log("✅ Token generated");
            res.json({ token });
        });

    } catch (error) {
        console.error("🚨 Server error:", error.message);
        res.status(500).send("Server error");
    }
});

// ✅ Export Correctly
module.exports = router;
