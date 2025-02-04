const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Register Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sessions", require("./routes/sessions"));

// ✅ DEBUG Route to check all registered API routes
app.get("/api/debug", (req, res) => {
    res.json({
        message: "API is running",
        routes: [
            { path: "/api/auth/login", methods: ["POST"] },
            { path: "/api/auth/signup", methods: ["POST"] }, // ✅ Now Included
            { path: "/api/sessions/start", methods: ["POST"] }
        ]
    });
});

// ✅ Root Route
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Connect to MongoDB
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
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
