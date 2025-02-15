const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

// Debug log to confirm .env is being read
console.log("✅ Environment variables loaded.");

// Ensure MongoDB URI exists
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("❌ MONGODB_URI is not defined in .env file!");
  process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(error => {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  });
