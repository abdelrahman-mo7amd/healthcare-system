// Vercel serverless entry point for the appointment-service Express app.
require("dotenv").config();
const connectDB = require("../config/db");
const app = require("../server");

connectDB().catch((err) => {
  console.error("[appointment-service] Vercel cold-start MongoDB connect failed:", err.message);
});

module.exports = app;