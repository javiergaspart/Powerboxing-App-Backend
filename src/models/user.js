const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["trainer", "boxer"], default: "boxer" },
    session_balance: { type: Number, default: 0 }, // ✅ Added Free Trial Session Balance
    trial: { type: Boolean, default: false } // ✅ Marks Newcomers for Trainers
});

module.exports = mongoose.model("User", UserSchema);
