const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ DEBUG: Log When App Starts
console.log("🚀 Starting Express Server...");

// ✅ Try to Import Routes and Catch Errors
try {
    console.log("📂 Importing auth routes...");
    const authRoutes = require("./routes/auth");
    app.use("/api/auth", authRoutes);
    console.log("✅ /api/auth routes registered");
} catch (error) {
    console.error("❌ ERROR: Could not load auth routes", error.message);
}

try {
    console.log("📂 Importing session routes...");
    const sessionRoutes = require("./routes/sessions");
    app.use("/api/sessions", sessionRoutes);
    console.log("✅ /api/sessions routes registered");
} catch (error) {
    console.error("❌ ERROR: Could not load session routes", error.message);
}

// ✅ Final Debugging - List All Registered Routes
app.get("/api/debug", (req, res) => {
    const availableRoutes = app._router.stack
        .filter((r) => r.route)
        .map((r) => r.route.path);

    console.log("✅ Registered Routes:", availableRoutes);

    res.json({
        message: "API is running",
        routes: availableRoutes,
    });
});

// ✅ Health Check Route
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ MongoDB Connection
mongoose
  .connect("mongodb+srv://fitboxing_admin:Powerboxing123@cluster0.nrz2j.mongodb.net/POWERBOXING?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("✅ Available Routes:", app._router.stack
        .filter((r) => r.route)
        .map((r) => r.route.path));
});
