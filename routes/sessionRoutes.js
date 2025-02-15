const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Debug log to check if this file is being loaded
console.log("✅ sessionRoutes.js is loaded");

// Register the route for creating or reserving sessions
router.post('/reserve-or-create', sessionController.createorReserveSession);

// Debug log to confirm route is registered
console.log("✅ Route /fitboxing/sessions/reserve-or-create is registered");

// Export the router
module.exports = router;
