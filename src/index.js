const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Import routes
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");

app.use(express.json());
app.use(cors());

// ✅ Debugging: Print Routes Before Registering
console.log("🔹 Registering Routes...");
console.log("🔹 authRoutes Type:", typeof authRoutes);
console.log("🔹 sessionRoutes Type:", typeof sessionRoutes);

// ✅ Ensure Routes Are Functions Before Using
if (typeof authRoutes !== "function" && typeof authRoutes !== "object") {
    throw new Error("❌ ERROR: authRoutes is not correctly exported. Check routes/auth.js");
}
if (typeof sessionRoutes !== "function" && typeof sessionRoutes !== "object") {
    throw new Error("❌ ERROR: sessionRoutes is not correctly exported. Check routes/sessions.js");
}

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Debugging Route
app.get("/api/debug", (req, res) => {
    res.json({
        message: "API is running",
        routes: [
            { path: "/api/auth/login", methods: ["POST"] },
            { path: "/api/auth/signup", methods: ["POST"] },
            { path: "/api/auth/user", methods: ["GET"] }, // ✅ Ensure this is included
            { path: "/api/sessions/start", methods: ["POST"] }
        ]
    });
});

// ✅ Default Route
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Connect to MongoDB and Start Server
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ ERROR: Missing MONGO_URI. Please set it in the environment variables.");
    process.exit(1);
}

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected Successfully");

        // Start server after DB connection
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1);
    }
};

startServer();
