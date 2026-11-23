
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Participant = require("./models/Participant");

async function createTestParticipants() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");

    const participants = [
      {
        name: "Test Participant",
        email: "test@gatekeeper.com",
        qrCode: "GK-TEST-001",
      },
      {
        name: "Pending Participant",
        email: "pending@gatekeeper.com",
        qrCode: "GK-TEST-002",
      },
    ];

    for (const person of participants) {
      const existing = await Participant.findOne({
        qrCode: person.qrCode,
      });

      if (existing) {
        console.log(`${person.name} already exists.`);
      } else {
        const created = await Participant.create(person);
        console.log("Created:", created.name);
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createTestParticipants();
