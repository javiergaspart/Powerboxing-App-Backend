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

        console.log("🔹 Signup Request Received:", req.body);

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            console.error("❌ User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create user with session_balance = 1 for trial users
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            session_balance: 1,  // ✅ New users start with 1 free session
            trial: true           // ✅ Mark them as trial users
        });

        await user.save();
        console.log("✅ User registered successfully:", email);
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
        console.log("🔹 Login Request Received:", email);

        let user = await User.findOne({ email });
        if (!user) {
            console.error("❌ Invalid email:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ Invalid password for:", email);
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

            console.log("✅ User Logged In:", user.email, "| Sessions:", user.session_balance);
            
            res.json({
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    session_balance: user.session_balance,  // ✅ Ensure this is included
                    trial: user.trial  // ✅ Include trial status
                }
            });
        });

    } catch (err) {
        console.error("🚨 Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Get User Profile (Requires Authentication)
router.get("/user", authMiddleware, async (req, res) => {
    try {
        console.log("🔹 Fetching user details...");

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            console.error("❌ User not found:", req.user.id);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User details retrieved:", user.email, "| Sessions:", user.session_balance);
        
        res.json({
            name: user.name,
            email: user.email,
            session_balance: user.session_balance,
            trial: user.trial
        });

    } catch (err) {
        console.error("🚨 Error fetching user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
