const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Ensure database connection

// ✅ Correct path references
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");

dotenv.config();
connectDB(); // Ensure database is connected

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Debug Logger - Log every request to confirm it's working
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// ✅ Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Debug Route to Check API Registration
app.get("/api/debug", (req, res) => {
    res.json({
        message: "API is working",
        status: "success",
        routes: [
            "/api/auth/login",
            "/api/auth/test",
            "/api/sessions/start",
            "/api/sessions/test"
        ],
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
