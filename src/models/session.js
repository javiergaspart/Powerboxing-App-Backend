const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["scheduled", "active", "completed"], default: "scheduled" },
});

module.exports = mongoose.model("Session", SessionSchema);
