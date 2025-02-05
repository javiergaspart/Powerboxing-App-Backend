const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Import routes and middleware
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");
const authMiddleware = require("./middlewares/authMiddleware"); // ✅ Ensure correct filename

app.use(express.json());
app.use(cors());

// ✅ Debugging: Print Middleware Types
console.log("🔹 authRoutes Type:", typeof authRoutes);
console.log("🔹 sessionRoutes Type:", typeof sessionRoutes);
console.log("🔹 authMiddleware Type:", typeof authMiddleware);

// ✅ Ensure `authMiddleware` is a function before using it
if (typeof authMiddleware !== "function") {
    throw new Error("authMiddleware is not a function! Check middlewares/authMiddleware.js");
}

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Debugging Route to check all API endpoints
app.get("/api/debug", (req, res) => {
    res.json({
        message: "API is running",
        routes: [
            { path: "/api/auth/login", methods: ["POST"] },
            { path: "/api/auth/signup", methods: ["POST"] },
            { path: "/api/sessions/start", methods: ["POST"] }
        ]
    });
});

// ✅ Default Route
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Ensure `MONGO_URI` is Defined
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌ ERROR: Missing MONGO_URI. Please set it in the environment variables.");
    process.exit(1);
}

// ✅ Connect to MongoDB and Start Server
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
