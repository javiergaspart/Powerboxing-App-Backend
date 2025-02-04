const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// ✅ SIGNUP Route
router.post("/signup", async (req, res) => {
    try {
        console.log("🔹 Signup request received:", req.body);
        const { name, email, password, role } = req.body;

        // Check for missing fields
        if (!name || !email || !password || !role) {
            console.error("❌ Missing fields:", req.body);
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("🔹 Checking if user already exists...");
        let user = await User.findOne({ email });
        if (user) {
            console.error("❌ User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("🔹 Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("🔹 Creating new user...");
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        console.log("✅ User registered successfully:", email);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("🚨 Signup Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ LOGIN Route
router.post("/login", async (req, res) => {
    try {
        console.log("🔹 Login request received:", req.body);
        const { email, password } = req.body;

        // Check if email exists
        let user = await User.findOne({ email });
        if (!user) {
            console.error("❌ Invalid email:", email);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ Incorrect password for:", email);
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate JWT Token
        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Login successful:", email);
        res.json({ token });

    } catch (err) {
        console.error("🚨 Login Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
