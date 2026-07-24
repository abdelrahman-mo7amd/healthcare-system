require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const staffRoutes = require("./routes/staffRoutes");
const patientRoutes = require("./routes/patientRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// This is the primary hospital backend's own CORS policy.
// The appointment-service is a SEPARATE origin/server and configures
// its own CORS independently -- do not merge them.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "backend", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

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
