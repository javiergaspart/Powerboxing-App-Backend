const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sessionRoutes = require('./routes/sessionRoutes');
const trainerRoutes = require('./routes/trainerRoutes'); // ✅ Trainer API
const userRoutes = require('./routes/userRoutes'); // ✅ User API

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Register Trainer Routes
console.log("✅ Registering trainerRoutes.js...");
app.use('/fitboxing/trainers', trainerRoutes); // ✅ Correct Path

// ✅ Register User Routes
console.log("✅ Registering userRoutes.js...");
app.use('/fitboxing/auth', userRoutes); // ✅ Correct Path

// ✅ Register Session Routes
console.log("✅ Registering sessionRoutes.js...");
app.use('/fitboxing/sessions', sessionRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
