// src/services/authService.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const registerUser = async (userData) => {
  const { username, email, password } = userData;
  console.log('Registering user with data:', userData);

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('Registration failed: User already exists');
    throw new Error('User already exists');
  }

  // Check if the password is provided
  if (!password) {
    console.log('Registration failed: Password is required');
    throw new Error('Password is required');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password hashed successfully');

  // Create new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  console.log('User registered successfully:', user);
  return user;
};

const loginUser = async (email, password) => {
  console.log('Logging in user with email:', email);
  
  const user = await User.findOne({ email });
  if (!user) {
    console.log('Login failed: Invalid email or password');
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Login failed: Invalid email or password');
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  console.log('Login successful, token generated:', token);

  return { token, user };
};

const forgotPassword = async (email) => {
  console.log('Initiating forgot password process for:', email);

  const user = await User.findOne({ email });
  if (!user) {
    console.log('Forgot password failed: Email not registered');
    throw new Error('Email not registered');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Store the hashed token and expiry in the database
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
  await user.save();

  console.log('Reset token generated and stored:', resetToken);

  // Send email with reset token
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.EMAIL_PASSWORD, // Your email password
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const message = `You have requested a password reset. Click the link to reset your password: ${resetUrl}`;
  
  await transporter.sendMail({
    to: email,
    subject: 'Password Reset',
    text: message,
  });

  console.log('Reset password email sent to:', email);
};

const resetPassword = async (token, newPassword) => {
  console.log('Resetting password with token:', token);

  // Hash the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by token and check if token is still valid
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    console.log('Reset password failed: Invalid or expired token');
    throw new Error('Invalid or expired token');
  }

  // Update the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  console.log('Password reset successfully for user:', user.email);
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
