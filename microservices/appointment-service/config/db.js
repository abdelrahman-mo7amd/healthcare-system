const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/healthcare_appointments";
  await mongoose.connect(uri);
  isConnected = true;
  console.log(`[appointment-service] MongoDB connected -> ${uri}`);
}

module.exports = connectDB;