const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth");

// ✅ User Signup Route
router.post("/signup", async (req, res) => {
    try {
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
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            session_balance: 1, // ✅ New users get 1 free session
            trial: true, // ✅ Mark them as a trial user
        });

        await user.save();
        console.log("✅ User registered successfully:", email);
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error("🚨 Signup Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        console.log("🔹 Checking if user exists...");
        let user = await User.findOne({ email });
        if (!user) {
            console.error("❌ Invalid credentials:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("🔹 Comparing passwords...");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ Invalid password:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("🔹 Generating JWT token...");
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("✅ Login successful:", email);
        res.json({ token });

    } catch (err) {
        console.error("🚨 Login Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Get User Details (Requires Authentication)
router.get("/user", authMiddleware, async (req, res) => {
    try {
        console.log("🔹 Fetching user details...");
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User details retrieved:", user.email);
        res.json({
            name: user.name,
            email: user.email,
            session_balance: user.session_balance,
            trial: user.trial,
        });

    } catch (err) {
        console.error("🚨 Error fetching user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
