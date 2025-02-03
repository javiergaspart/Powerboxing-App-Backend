const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// ✅ Force all routes to load from `src/`
app.use("/api/auth", require(path.join(__dirname, "routes/auth")));
app.use("/api/sessions", require(path.join(__dirname, "routes/sessions")));

// ✅ Root Route to Verify API is Running
app.get("/", (req, res) => {
  res.send("Powerboxing API is running...");
});

// ✅ Error Handling
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
