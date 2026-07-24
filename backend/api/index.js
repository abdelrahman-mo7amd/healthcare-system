// Vercel serverless entry point for the backend Express app.
// Vercel's Node runtime detects a module exporting an (req, res)
// handler -- an Express app instance satisfies that directly.
require("dotenv").config();
const connectDB = require("../config/db");
const app = require("../server");

// Mongoose buffers model operations until the connection is ready, so
// it's safe to kick this off without awaiting it here. On serverless
// "cold starts" this connects once per container; mongoose itself
// avoids opening a second connection on warm invocations.
connectDB().catch((err) => {
  console.error("[backend] Vercel cold-start MongoDB connect failed:", err.message);
});

module.exports = app;
