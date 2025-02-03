const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Log All Registered Routes
const listRoutes = require("express-list-endpoints"); // Install: npm install express-list-endpoints
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});

// ✅ Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Route to List All Available API Endpoints
app.get("/api/debug", (req, res) => {
    res.json({
        message: "API is working",
        routes: listRoutes(app),
    });
});

// ✅ Health Check
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("✅ Registered Routes:", listRoutes(app));
});