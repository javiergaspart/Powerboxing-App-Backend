const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Import routes and middleware
const authRoutes = require("./routes/auth"); // ✅ Ensure this is a function
const sessionRoutes = require("./routes/sessions");
const authMiddleware = require("./middlewares/authMiddleware");

app.use(express.json());
app.use(cors());

// ✅ Debugging: Print Middleware Types
console.log("🔹 authRoutes Type:", typeof authRoutes);
console.log("🔹 sessionRoutes Type:", typeof sessionRoutes);
console.log("🔹 authMiddleware Type:", typeof authMiddleware);

// ✅ Ensure `authRoutes` is a function before using it
if (typeof authRoutes !== "function") {
    throw new Error("authRoutes is not a function! Check routes/auth.js");
}

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

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
