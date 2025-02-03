const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // ✅ Ensure correct DB connection
const authRoutes = require("./routes/auth"); // ✅ Ensure correct path

dotenv.config();

// ✅ Initialize Express App
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// ✅ Define Routes
app.use("/api/auth", authRoutes); // ✅ Ensure this is registered correctly

// ✅ Test Root API
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
