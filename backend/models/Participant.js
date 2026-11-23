const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
