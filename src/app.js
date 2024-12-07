// src/app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const punchingBagRoutes = require('./routes/punchingBagRoutes');
const resultRoutes = require('./routes/resultsRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.json());


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("\x1b[32m"+ `Successfully connected to mongoDB at Port: ${process.env.PORT}`+ "\x1b[0m");
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Route definitions
app.use('/fitboxing/auth', authRoutes);                    // Handles authentication routes
app.use('/fitboxing/punching-bags', punchingBagRoutes);    // Handles punching bag routes
app.use('/fitboxing/results', resultRoutes);               // Handles results routes
app.use('/fitboxing/sensors', sensorRoutes);               // Handles sensor routes
app.use('/fitboxing/sessions', sessionRoutes);             // Handles session routes
app.use('/fitboxing/users', userRoutes);                   // Handles user-related routes
app.use('/fitboxing/payments', paymentRoutes);             // Handles payment-related routes


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the app for testing or further configuration
module.exports = app;
