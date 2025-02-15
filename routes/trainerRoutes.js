const express = require("express");
const router = express.Router();
const { signupTrainer, loginTrainer } = require("../controllers/trainerController");

// Trainer Signup Route
router.post("/signup", signupTrainer);

// Trainer Login Route
router.post("/login", loginTrainer);

module.exports = router;
