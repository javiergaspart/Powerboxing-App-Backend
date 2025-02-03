const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Ensure DB connection
const authRoutes = require("./routes/auth"); // Ensure correct path

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// ✅ Define Routes
app.use("/api/auth", authRoutes); // This must be registered!

// ✅ Test Root API
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));