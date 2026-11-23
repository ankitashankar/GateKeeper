const express = require("express");
const { randomUUID } = require("crypto");
const Participant = require("../models/Participant");

const router = express.Router();

// Student Registration API
router.post("/register", async (req, res) => {
  try {
    let { name, usn, email, phone, eventName } = req.body;

    // Validate required fields
    if (!name || !usn || !email || !phone || !eventName) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Normalize input
    name = name.trim();
    usn = usn.trim().toUpperCase();
    email = email.trim().toLowerCase();
    phone = phone.trim();
    eventName = eventName.trim();
    // Validate USN format
    const usnPattern = /^4NI\d{2}[A-Z]{2}\d{3}$/;

    if (!usnPattern.test(usn)) {
    return res.status(400).json({
        message: "Invalid USN format. Example: 4NI24IS123"
    });
    }

    // Check for existing registration
    const existingParticipant = await Participant.findOne({
      usn,
      eventName
    });

    if (existingParticipant) {
      return res.status(409).json({
        message: "This student is already registered for this event."
      });
    }

    // Generate unique identifiers
    const registrationId = `GK-${randomUUID()}`;
    const qrCode = randomUUID();

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

    return res.status(201).json({
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

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

module.exports = router;