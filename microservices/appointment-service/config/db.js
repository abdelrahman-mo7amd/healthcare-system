const mongoose = require("mongoose");

// Deliberately its own connection / its own database, separate from
// the primary backend. This is what makes the service independently
// scalable and independently failable.
async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/healthcare_appointments";
  try {
    await mongoose.connect(uri);
    console.log(`[appointment-service] MongoDB connected -> ${uri}`);
  } catch (err) {
    console.error("[appointment-service] MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
