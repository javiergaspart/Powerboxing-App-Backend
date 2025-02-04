const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Import Routes
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Debug Route - Show All Available API Routes
app.get("/api/debug", (req, res) => {
    const availableRoutes = app._router.stack
        .filter((r) => r.route)
        .map((r) => r.route.path);

    res.json({
        message: "API is running",
        routes: availableRoutes,
    });
});

// ✅ Health Check
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
    console.log("✅ Available Routes:", availableRoutes);
});