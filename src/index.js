const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Replace `process.env.MONGODB_URI` with the actual connection string
const MONGODB_URI = "mongodb+srv://Fitboxing_admin:Powerboxing123@cluster0.mongodb.net/powerboxing?retryWrites=true&w=majority";

// ✅ MongoDB Connection
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

app.get("/", (req, res) => res.send("Powerboxing API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
