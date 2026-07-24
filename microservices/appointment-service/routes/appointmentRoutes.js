const express = require("express");
const {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  getStats,
} = require("../controllers/appointmentController");
const { authGuard } = require("../middleware/authGuard");

const router = express.Router();

// Stats endpoint is intentionally unauthenticated + cheap so the
// backend's dashboard poll never gets blocked on auth overhead.
router.get("/stats", getStats);

router.use(authGuard);
router.get("/", listAppointments);
router.post("/", createAppointment);
router.get("/:id", getAppointment);
router.put("/:id", updateAppointment);
router.post("/:id/cancel", cancelAppointment);

module.exports = router;
