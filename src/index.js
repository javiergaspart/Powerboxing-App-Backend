const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Verify That `routes/` Folder Exists
if (!fs.existsSync("./routes/auth.js")) {
    console.error("❌ ERROR: Missing `routes/auth.js`");
} else {
    console.log("✅ Found `routes/auth.js`");
}

if (!fs.existsSync("./routes/sessions.js")) {
    console.error("❌ ERROR: Missing `routes/sessions.js`");
} else {
    console.log("✅ Found `routes/sessions.js`");
}

// ✅ Import Routes
try {
    const authRoutes = require("./routes/auth");
    app.use("/api/auth", authRoutes);
} catch (error) {
    console.error("❌ ERROR: Failed to load `auth.js`", error.message);
}

try {
    const sessionRoutes = require("./routes/sessions");
    app.use("/api/sessions", sessionRoutes);
} catch (error) {
    console.error("❌ ERROR: Failed to load `sessions.js`", error.message);
}

// ✅ Debug Route - Show All Available API Routes
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
});
