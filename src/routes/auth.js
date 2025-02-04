const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();
const router = express.Router();

// ✅ Debug Log to Confirm Route is Loaded
console.log("✅ Auth route file is being executed");

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
    console.log("🔹 Login route hit");

    const { email, password } = req.body;
    try {
        if (!email || !password) {
            console.log("❌ Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ User not found: ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password");
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

// ✅ Debug Log to Show All Registered Routes in This File
console.log("✅ Auth Route List:", router.stack.map((r) => r.route?.path));

module.exports = router;
