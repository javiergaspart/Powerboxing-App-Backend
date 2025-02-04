const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();
const router = express.Router();

// ✅ DEBUG: Ensure file is loaded
console.log("✅ Auth route loaded");

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
    console.log("🔹 Login route hit");

    const { email, password } = req.body;
    try {
        // ✅ Ensure email and password are provided
        if (!email || !password) {
            console.log("❌ Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        // ✅ Find user in MongoDB
        let user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ User not found: ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT Token
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

// ✅ Test Route to Ensure `/api/auth` is Working
router.get("/test", (req, res) => {
    console.log("✅ Auth route test successful");
    res.json({ message: "Auth route is active" });
});

// ✅ Export Correctly
module.exports = router;
