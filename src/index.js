const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Log API Calls
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// ✅ Health Check
app.get("/", (req, res) => res.send("Powerboxing API is running..."));

// ✅ Debug Route - LIST ALL ROUTES
app.get("/api/debug", (req, res) => {
    const allRoutes = app._router.stack
        .filter((r) => r.route)
        .map((r) => r.route.path);

    res.json({ message: "API is running", registeredRoutes: allRoutes });
});

// ✅ MongoDB Connection
mongoose
  .connect("mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/powerboxing?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
