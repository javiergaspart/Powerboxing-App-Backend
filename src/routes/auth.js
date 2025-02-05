const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth"); // ✅ Ensure this import is correct

// ✅ Fix the route to correctly apply the middleware
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
