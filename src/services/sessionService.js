const { v4: uuidv4 } = require('uuid'); // Import UUID for unique session IDs
const Session = require('../models/sessionModel');

exports.reserveOrCreateSession = async ({ trainerId, slots }) => {
  try {
    console.log("✅ reserveOrCreateSession function called");

    if (!trainerId || !slots || slots.length === 0) {
      throw new Error("Trainer ID and slots are required.");
    }

    const newSessions = slots.map(slot => ({
      session_id: uuidv4(), // ✅ Generates a unique session ID
      trainerId,
      timeSlot: slot,
      participants: [],
      createdAt: new Date(),
    }));

    await Session.insertMany(newSessions);

    console.log("✅ Sessions created successfully.");
    return { message: "Sessions created successfully", sessions: newSessions };
  } catch (error) {
    console.error("❌ Error in reserveOrCreateSession:", error);
    throw error;
  }
};

// ✅ Get all sessions
exports.getSessions = async () => {
  try {
    return await Session.find();
  } catch (error) {
    console.error("❌ Error retrieving sessions:", error);
    throw error;
  }
};

// ✅ Check session availability
exports.checkSessionAvailability = async (sessionId) => {
  try {
    const session = await Session.findById(sessionId);
    return session && session.participants.length < session.maxParticipants;
  } catch (error) {
    console.error("❌ Error checking session availability:", error);
    throw error;
  }
};

