const express = require("express");
const {
  createPatient,
  listPatients,
  getPatient,
  updatePatient,
  deletePatient,
  addVitals,
} = require("../controllers/patientController");
const { authGuard, requireRole } = require("../middleware/authGuard");

const router = express.Router();

router.use(authGuard);

router.get("/", listPatients);
router.post("/", requireRole("doctor", "nurse", "admin"), createPatient);
router.get("/:id", getPatient);
router.put("/:id", requireRole("doctor", "nurse", "admin"), updatePatient);
router.delete("/:id", requireRole("doctor", "admin"), deletePatient);
router.post("/:id/vitals", requireRole("doctor", "nurse"), addVitals);

module.exports = router;
