const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/userModel");
const Trainer = require("../models/trainerModel");
require("dotenv").config();

// Middleware for verifying JWT
const authMiddleware = require("../middleware/authMiddleware");

// User and Trainer Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check both Users and Trainers collections
        let user = await User.findOne({ email });
        let isTrainer = false;

        if (!user) {
            user = await Trainer.findOne({ email });
            isTrainer = true;
        }

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("Stored Hash:", user.password);
        console.log("Entered Password:", password);

        // Compare the entered password with stored hash
        const isMatch = bcrypt.compareSync(password, user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: isTrainer ? "trainer" : "user" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ token, role: isTrainer ? "trainer" : "user", user });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get logged-in user details
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            const trainer = await Trainer.findById(req.user.id).select("-password");
            return trainer
                ? res.json(trainer)
                : res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Fetch user error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// User and Trainer Registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let userExists = await User.findOne({ email });
        let trainerExists = await Trainer.findOne({ email });

        if (userExists || trainerExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        let newUser;

        if (role === "trainer") {
            newUser = new Trainer({
                name,
                email,
                password: hashedPassword,
                phone,
                role: "trainer",
                sessions_created: [],
            });
        } else {
            newUser = new User({
                name,
                email,
                password: hashedPassword,
                role: "user",
                session_balance: 1, // Give 1 free session
            });
        }

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
