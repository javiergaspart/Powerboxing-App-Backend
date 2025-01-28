const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection string from your .env file
const mongoURI = process.env.MONGODB_URI;

// Define the trainer schema
const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Trainer = mongoose.model('Trainer', trainerSchema);

// Function to add a trainer
const addTrainer = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB...");

    // Encrypt password
    const hashedPassword = await bcrypt.hash('trainerpass', 10);

    const newTrainer = new Trainer({
      name: 'Trainer One',
      email: 'trainer1@email.com',
      password: hashedPassword
    });

    await newTrainer.save();
    console.log('Trainer added successfully:', newTrainer);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error adding trainer:', error);
    mongoose.disconnect();
  }
};

// Run the function
addTrainer();
