const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Import API routes
const authRoutes = require('./routes/auth'); // <-- Ensure this exists
const sessionRoutes = require('./routes/sessions');

// ✅ REGISTER API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

// ✅ Root route for debugging
app.get('/', (req, res) => {
    res.send('Powerboxing API is running...');
});

// ✅ Log registered routes (for debugging)
const listEndpoints = require('express-list-endpoints');
console.log('📌 Registered API Routes:', listEndpoints(app));

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Failed:', err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
