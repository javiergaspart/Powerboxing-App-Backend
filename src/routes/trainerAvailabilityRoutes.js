const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Define Mongoose Schema for Trainer Availability
const trainerAvailabilitySchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  slots: [String], // Array of selected time slots
  createdAt: { type: Date, default: Date.now },
});

// Create Model
const TrainerAvailability = mongoose.model("TrainerAvailability", trainerAvailabilitySchema);

// POST Route: Save Trainer Availability
router.post("/api/trainer/availability", async (req, res) => {
  try {
    const { trainerId, slots } = req.body;

    if (!trainerId || !slots || slots.length === 0) {
      return res.status(400).json({ error: "Trainer ID and slots are required" });
    }

    const availability = new TrainerAvailability({ trainerId, slots });
    await availability.save();

    res.json({ message: "Availability saved successfully", slots });
  } catch (error) {
    console.error("Error saving trainer availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET Route: Fetch Trainer Availability
router.get("/api/trainer/availability/:trainerId", async (req, res) => {
  try {
    const { trainerId } = req.params;
    const availability = await TrainerAvailability.find({ trainerId });

    if (!availability) {
      return res.status(404).json({ error: "No availability found" });
    }

    res.json(availability);
  } catch (error) {
    console.error("Error fetching trainer availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
