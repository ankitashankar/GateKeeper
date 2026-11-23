const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const Participant = require("./models/Participant");
const registrationRoutes = require("./routes/registration");

const app = express();

// Middleware
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

    const participant = await Participant.findOne({ qrCode });

    if (!participant) {
      return res.status(404).json({
        message: "Invalid QR Code. Participant not found."
      });
    }

    if (participant.checkedIn) {
      return res.status(409).json({
        message: "Already checked in!"
      });
    }

    participant.checkedIn = true;
    participant.checkInTime = new Date();

    await participant.save();

    res.status(200).json({
      message: "Check-in successful!",
      participant: participant.name
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Start backend server independently of MongoDB
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch(error => {
    console.error("MongoDB Connection Failed:", error.message);
  });