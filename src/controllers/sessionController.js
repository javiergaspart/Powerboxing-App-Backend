const Session = require("../models/sessionModel");

exports.saveAvailability = async (req, res) => {
  try {
    const { slots } = req.body;

    if (!slots || !Array.isArray(slots)) {
      return res.status(400).json({ success: false, message: "Invalid slots data" });
    }

    await Session.insertMany(slots);
    res.json({ success: true, message: "Trainer availability saved" });

  } catch (error) {
    console.error("Error saving availability:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
