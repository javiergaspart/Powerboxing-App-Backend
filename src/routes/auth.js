const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware"); // ✅ Ensure correct import

// ✅ User Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            session_balance: 1,  // ✅ New users start with 1 free session
            trial: true
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error("🚨 Signup Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ User Login Route (Returns session_balance)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    session_balance: user.session_balance,
                    trial: user.trial
                }
            });
        });

    } catch (err) {
        console.error("🚨 Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Ensure `router` is correctly exported
module.exports = router;
