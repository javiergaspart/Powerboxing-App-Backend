const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const listEndpoints = require("express-list-endpoints"); // 🔥 LOG FULL ROUTES

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Debugging: Log When App Starts
console.log("🚀 Starting Express Server...");

// ✅ Import Routes
console.log("📂 Importing auth routes...");
const authRoutes = require("./routes/auth");
console.log("✅ Auth route file is being executed");
app.use("/api/auth", authRoutes);
console.log("✅ /api/auth routes registered");

console.log("📂 Importing session routes...");
const sessionRoutes = require("./routes/sessions");
console.log("✅ Sessions route loaded");
app.use("/api/sessions", sessionRoutes);
console.log("✅ /api/sessions routes registered");

// ✅ Debug Route - Show Full Express Route Tree
app.get("/api/debug", (req, res) => {
    const routes = listEndpoints(app);  // 🔥 fuckLOG FULL EXPRESS ROUTE TREE
    console.log("✅ FULL EXPRESS ROUTE TREE:", routes);
    res.json({ message: "API is running", routes });
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
});
