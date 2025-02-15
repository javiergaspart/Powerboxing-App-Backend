const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Trainer = require("../models/trainerModel");

// Trainer Signup
exports.signupTrainer = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let trainer = await Trainer.findOne({ email });
    if (trainer) {
      return res.status(400).json({ message: "Trainer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    trainer = new Trainer({ name, email, password: hashedPassword });
    await trainer.save();

    res.status(201).json({ message: "Trainer registered successfully", trainer });
  } catch (error) {
    console.error("❌ Error in signupTrainer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Trainer Login
exports.loginTrainer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const trainer = await Trainer.findOne({ email });
    if (!trainer || !(await bcrypt.compare(password, trainer.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: trainer._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, trainer });
  } catch (error) {
    console.error("❌ Error in loginTrainer:", error);
    res.status(500).json({ message: "Server error" });
  }
};
