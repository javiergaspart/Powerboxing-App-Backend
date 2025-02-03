const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Ensure database connection
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");

dotenv.config();
connectDB(); // Ensure database is connected

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ DEBUG: Log all requests to check if API is active
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Health Check
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Debug Route to Verify API Works
app.get("/api/debug", (req, res) => {
    res.json({
        message: "API is working",
        status: "success",
        routes: ["/api/auth", "/api/sessions"],
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
