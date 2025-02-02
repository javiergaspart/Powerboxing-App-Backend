const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes (Corrected paths)
const sessionRoutes = require('./routes/sessions');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

// Register API routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Powerboxing API is running...');
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Failed:', err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
