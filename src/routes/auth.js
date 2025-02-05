const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// ✅ SIGNUP Route (Now Includes Free Trial)
router.post("/signup", async (req, res) => {
    try {
        console.log("🔹 Signup request received:", req.body);
        const { name, email, password, role } = req.body;

        // Check for missing fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("🔹 Checking if user already exists...");
        let user = await User.findOne({ email });
        if (user) {
            console.error("❌ User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("🔹 Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("🔹 Creating new user with free trial...");
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            session_balance: 1, // ✅ Free Trial Session
            trial: true // ✅ Mark as a Trial User
        });

        await user.save();

        console.log("✅ User registered successfully:", email);
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error("🚨 Signup Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
