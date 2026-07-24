const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/healthcare";
  try {
    await mongoose.connect(uri);
    console.log(`[backend] MongoDB connected -> ${uri}`);
  } catch (err) {
    console.error("[backend] MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
