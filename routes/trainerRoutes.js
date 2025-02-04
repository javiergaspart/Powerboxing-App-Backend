const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Trainer = require('../models/Trainer');
const router = express.Router();

// Secret key for JWT (make sure it's set in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Trainer Registration Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if trainer already exists
        const existingTrainer = await Trainer.findOne({ email });
        if (existingTrainer) {
            return res.status(400).json({ message: 'Trainer already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new trainer
        const trainer = new Trainer({
            name,
            email,
            password: hashedPassword
        });

        await trainer.save();

        res.status(201).json({ message: 'Trainer registered successfully' });
    } catch (error) {
        console.error('Error registering trainer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Trainer Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if trainer exists
        const trainer = await Trainer.findOne({ email });
        if (!trainer) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, trainer.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ trainerId: trainer._id, email: trainer.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all trainers (for testing purposes)
router.get('/all', async (req, res) => {
    try {
        const trainers = await Trainer.find().select('-password'); // Exclude passwords from response
        res.status(200).json({ trainers });
    } catch (error) {
        console.error('Error fetching trainers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.trainer = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Protected route example
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.trainer.trainerId).select('-password');
        res.status(200).json({ trainer });
    } catch (error) {
        console.error('Error fetching trainer profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
