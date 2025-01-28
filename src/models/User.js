const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    newcomer: {
        type: Boolean,
        default: true // Mark user as a newcomer
    },
    sessionBalance: {
        type: Number,
        default: 1 // New users start with 1 free session
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

