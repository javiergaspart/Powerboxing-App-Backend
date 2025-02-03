const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Import API routes (Ensure correct paths)
const sessionRoutes = require('./routes/sessions');
const authRoutes = require('./routes/auth');

app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);

// ✅ Root route to check if the server is running
app.get('/', (req, res) => {
    res.send('Powerboxing API is running...');
});

// ✅ DEBUG: Log all registered routes
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
