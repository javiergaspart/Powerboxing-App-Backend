const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ensure this path is correct

const router = express.Router();

// ✅ SIGNUP Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        // Return success message
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ LOGIN Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
