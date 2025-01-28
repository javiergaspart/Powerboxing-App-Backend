const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);

// Login route - Ensure this exists
router.post('/login', authController.login);

module.exports = router;
