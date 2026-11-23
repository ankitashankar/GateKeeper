
const dns = require("dns");
dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Participant = require("./models/Participant");

async function updateQR() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const participant = await Participant.findOneAndUpdate(
      { name: "Pending Participant" },
      { qrCode: "https://q.me-qr.com/jok5457y" },
      { new: true }
    );

    if (!participant) {
      console.log("Pending Participant not found!");
    } else {
      console.log("QR code updated successfully!");
      console.log(participant);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateQR();
