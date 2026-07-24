const mongoose = require("mongoose");

// Caches the connection across warm serverless invocations instead of
// reconnecting on every request.
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/healthcare";
  await mongoose.connect(uri);
  isConnected = true;
  console.log(`[backend] MongoDB connected -> ${uri}`);
}

module.exports = connectDB;