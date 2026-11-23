const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  usn: {
    type: String,
    trim: true,
    uppercase: true,
    default: "",
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },

  phone: {
    type: String,
    default: "",
  },

  eventName: {
    type: String,
    default: "",
  },

  qrCode: {
    type: String,
    required: true,
    unique: true,
  },

  checkedIn: {
    type: Boolean,
    default: false,
  },

  checkInTime: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Participant", participantSchema);
