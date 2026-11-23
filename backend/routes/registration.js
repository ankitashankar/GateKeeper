const express = require("express");
const { randomUUID } = require("crypto");
const Participant = require("../models/Participant");

const router = express.Router();

// Student Registration API
router.post("/register", async (req, res) => {
  try {
    const { name, usn, email, phone, eventName } = req.body;

    // Validate required fields
    if (!name || !usn || !email || !phone || !eventName) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Generate unique registration ID
    const registrationId = `GK-${randomUUID()}`;

    // Generate unique QR identifier
    const qrCode = randomUUID();

    // Create participant
    const participant = new Participant({
      registrationId,
      name,
      usn,
      email,
      phone,
      eventName,
      qrCode
    });

    await participant.save();

    res.status(201).json({
      message: "Registration successful!",
      registrationId: participant.registrationId,
      qrCode: participant.qrCode
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This student is already registered for this event."
      });
    }

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

module.exports = router;