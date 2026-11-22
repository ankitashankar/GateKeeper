
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
});

module.exports = mongoose.model("Participant", participantSchema);
