const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const Participant = require("./models/Participant");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Gatekeeper Backend is Running!");
});

// Register a participant and issue the unique QR payload used at check-in.
app.post("/api/registration/register", async (req, res) => {
  try {
    const { name, usn, email, phone, eventName } = req.body;

    if (!name?.trim() || !usn?.trim() || !email?.trim() || !phone?.trim() || !eventName?.trim()) {
      return res.status(400).json({
        message: "Name, USN, email, phone and event name are required.",
      });
    }

    const normalizedUsn = usn.trim().toUpperCase();
    const existing = await Participant.findOne({ usn: normalizedUsn });

    if (existing) {
      return res.status(409).json({
        message: "This USN is already registered.",
      });
    }

    const registrationId = crypto.randomUUID();

    const participant = await Participant.create({
      name: name.trim(),
      usn: normalizedUsn,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      eventName: eventName.trim(),
      qrCode: registrationId,
    });

    return res.status(201).json({
      message: "Registration successful.",
      registrationId: participant.qrCode,
      participant: {
        name: participant.name,
        usn: participant.usn,
        email: participant.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This participant is already registered." });
    }
    return res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// Verify QR atomically so two scanners cannot check in the same person twice.
app.post("/api/verify", async (req, res) => {
  try {
    const { qrCode } = req.body;

    if (!qrCode) {
      return res.status(400).json({ message: "QR code is required" });
    }

    const participant = await Participant.findOneAndUpdate(
      { qrCode: qrCode.trim(), checkedIn: false },
      { $set: { checkedIn: true, checkInTime: new Date() } },
      { new: true }
    );

    if (participant) {
      return res.status(200).json({
        message: "Check-in successful!",
        participant: participant.name,
      });
    }

    const existing = await Participant.findOne({ qrCode: qrCode.trim() });

    if (!existing) {
      return res.status(404).json({
        message: "Invalid QR Code. Participant not found.",
      });
    }

    return res.status(409).json({
      message: "Already checked in!",
      participant: existing.name,
      checkInTime: existing.checkInTime,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get attendance statistics
app.get("/api/attendance/stats", async (req, res) => {
  try {
    const total = await Participant.countDocuments();
    const checkedIn = await Participant.countDocuments({ checkedIn: true });
    const pending = total - checkedIn;

    res.json({ total, checkedIn, pending });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch attendance statistics",
    });
  }
});

// Get all participants in registration order for the first-come queue.
app.get("/api/participants", async (req, res) => {
  try {
    const participants = await Participant.find()
      .select("name usn email qrCode checkedIn checkInTime createdAt")
      .sort({ createdAt: 1, _id: 1 });

    res.json(participants);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch participants",
    });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error.message);
  });
