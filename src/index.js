const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.set("strictQuery", false); // Suppress warnings

const MONGODB_URI = "mongodb+srv://fitboxing_admin:Powerboxing123@cluster0.nrz2j.mongodb.net/POWERBOXING?retryWrites=true&w=majority&appName=Cluster0";

// ✅ Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Prevents long hangs if MongoDB is unreachable
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// ✅ Manually Import Routes
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Debug Route: Show All Registered Routes
app.get("/api/debug", (req, res) => {
    const allRoutes = app._router.stack
        .filter((r) => r.route)
        .map((r) => r.route.path);
    res.json({ message: "API is running", registeredRoutes: allRoutes });
});

// ✅ Health Check Route
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
