const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const Participant = require("./models/Participant");
const registrationRoutes = require("./routes/registration");

const app = express();

app.use(cors());
app.use(express.json());

// Registration API
app.use("/api/registration", registrationRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Gatekeeper Backend is Running!");
});

// Verify QR Code and prevent duplicate check-ins
app.post("/api/verify", async (req, res) => {
  try {
    const { qrCode } = req.body;

    if (!qrCode) {
      return res.status(400).json({
        message: "QR code is required"
      });
    }

    // Atomic update prevents duplicate simultaneous check-ins
    const participant = await Participant.findOneAndUpdate(
      { qrCode: qrCode.trim(), checkedIn: false },
      {
        $set: {
          checkedIn: true,
          checkInTime: new Date()
        }
      },
      { new: true }
    );

    if (participant) {
      return res.status(200).json({
        message: "Check-in successful!",
        participant: participant.name
      });
    }

    const existing = await Participant.findOne({
      qrCode: qrCode.trim()
    });

    if (!existing) {
      return res.status(404).json({
        message: "Invalid QR Code. Participant not found."
      });
    }

    return res.status(409).json({
      message: "Already checked in!",
      participant: existing.name,
      checkInTime: existing.checkInTime
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Attendance statistics
app.get("/api/attendance/stats", async (req, res) => {
  try {
    const total = await Participant.countDocuments();
    const checkedIn = await Participant.countDocuments({
      checkedIn: true
    });

    res.json({
      total,
      checkedIn,
      pending: total - checkedIn
    });

  } catch (error) {
    res.status(500).json({
      message: "Could not fetch attendance statistics"
    });
  }
});

// Get all participants
app.get("/api/participants", async (req, res) => {
  try {
    const participants = await Participant.find()
      .select("name usn email qrCode checkedIn checkInTime createdAt")
      .sort({ createdAt: 1, _id: 1 });

    res.json(participants);

  } catch (error) {
    res.status(500).json({
      message: "Could not fetch participants"
    });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("MongoDB Connection Failed:", error.message);
  });