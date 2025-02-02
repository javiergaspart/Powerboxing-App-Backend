const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const sessionRoutes = require('./src/routes/sessions'); // Updated path
const authRoutes = require('./src/routes/auth'); // Updated path

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Failed:', err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
