const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User registration
exports.register = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            phone,
            password: hashedPassword,
            joinDate: new Date(),
            newcomer: true,
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                joinDate: newUser.joinDate,
                newcomer: newUser.newcomer,
            },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                joinDate: user.joinDate,
                newcomer: user.newcomer,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                joinDate: user.joinDate,
                newcomer: user.newcomer,
            },
        });
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ error: 'Server error retrieving profile' });
    }
};

// Middleware to protect routes
exports.authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
