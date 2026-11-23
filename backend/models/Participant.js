const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  usn: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Prevent duplicate registration for the same event
participantSchema.index(
  { usn: 1, eventName: 1 },
  { unique: true }
);

module.exports = mongoose.model("Participant", participantSchema);