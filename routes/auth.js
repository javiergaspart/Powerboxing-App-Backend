const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { Trainer } = require("../models/trainerModel"); // Ensure Trainer model exists
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Debug log for route initialization
console.log("✅ Auth route file is being executed");

// ✅ REGISTER USER
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        console.log("🔵 Signup Request:", { name, email, role });

        // Ensure role is either "boxer" or "trainer"
        if (!["boxer", "trainer"].includes(role)) {
            console.log("❌ Invalid role provided");
            return res.status(400).json({ message: "Invalid role" });
        }

        // Check if user already exists
        const existingUser = await (role === "trainer" ? Trainer : User).findOne({ email });
        if (existingUser) {
            console.log("❌ Email already in use:", email);
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const newUser = new (role === "trainer" ? Trainer : User)({
            name,
            email,
            password: hashedPassword,
            role
        });

        if (role === "boxer") {
            newUser.session_balance = 1; // ✅ Give 1 free session to new boxers
        }

        // Save user to database
        await newUser.save();
        console.log(`✅ New ${role} created:`, newUser);

        // Generate JWT
        const payload = { id: newUser.id, role: newUser.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ token, user: newUser });

    } catch (error) {
        console.error("🔥 Signup Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ LOGIN USER/TRAINER
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔵 Login Attempt:", email);

        let user = await User.findOne({ email });
        let role = "boxer";

        if (!user) {
            console.log("🔄 Checking trainer collection...");
            user = await Trainer.findOne({ email });
            role = "trainer";
        }

        if (!user) {
            console.log("❌ No user found with email:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password for:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        console.log(`✅ ${role} logged in:`, user.name);
        res.json({ token, user });

    } catch (error) {
        console.error("🔥 Login Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ GET LOGGED-IN USER/TRAINER INFO
router.get("/me", authMiddleware, async (req, res) => {
    try {
        console.log("🔵 Request to /me from user ID:", req.user.id);

        let user = await User.findById(req.user.id).select("-password");
        if (!user) {
            console.log("🔄 Checking trainer collection...");
            user = await Trainer.findById(req.user.id).select("-password");
        }

        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ Authenticated User:", user.name);
        res.json(user);

    } catch (error) {
        console.error("🔥 Server Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ EXPORT ROUTER
module.exports = router;
