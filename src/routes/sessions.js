const express = require('express');
const router = express.Router();
const Session = require('../models/sessionModel'); // ✅ Ensure this model exists

// GET: Fetch all sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    console.error('❌ Error fetching sessions:', error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;