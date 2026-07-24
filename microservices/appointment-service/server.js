require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const appointmentRoutes = require("./routes/appointmentRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// SYSTEM WARNING FIX: this is a brand new origin from the browser's
// perspective (different port/host than the primary backend), so it
// needs its OWN explicit CORS allowlist. Do not disable CORS globally
// and do not just copy the primary backend's config blindly -- keep
// the two independent so each service can evolve its origin policy
// on its own.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "appointment-service", time: new Date().toISOString() });
});

app.use("/api/appointments", appointmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error("[backend] Fatal: could not connect to MongoDB on startup:", err.message);
    process.exit(1); // fine here: this only runs for `node server.js` / Docker, never on Vercel
  }
  app.listen(PORT, () => console.log(`[backend] listening on port ${PORT}`));
}

if (require.main === module) {
  start();
}

module.exports = app;
