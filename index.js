const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Importing routes
const authRoutes = require('./src/routes/authRoutes');
const trainerRoutes = require('./src/routes/trainerRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/fitboxing/auth', authRoutes);
app.use('/fitboxing/trainer', trainerRoutes);

// Root Route to check if the server is running
app.get('/', (req, res) => {
    res.send('FitBoxing Backend is Running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
