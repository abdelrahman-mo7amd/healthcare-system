const fetch = require("node-fetch");
const Patient = require("../models/Patient");
const Staff = require("../models/Staff");

// Aggregates data owned by this service with live data from the
// independent appointment-service. If the appointment service is
// slow or down (e.g. under a booking surge), the dashboard still
// responds with patient/staff data -- this is the whole point of
// extracting appointments into their own service.
async function getDashboardStats(req, res, next) {
  try {
    const [totalPatients, admitted, outpatient, totalStaff] = await Promise.all([
      Patient.countDocuments({}),
      Patient.countDocuments({ status: "admitted" }),
      Patient.countDocuments({ status: "outpatient" }),
      Staff.countDocuments({}),
    ]);

    let appointmentStats = { todayCount: 0, upcomingCount: 0, source: "unavailable" };
    try {
      const url = `${process.env.APPOINTMENT_SERVICE_URL || "http://localhost:5001"}/api/appointments/stats`;
      const resp = await fetch(url, { timeout: 3000 });
      if (resp.ok) {
        appointmentStats = { ...(await resp.json()), source: "live" };
      }
    } catch (e) {
      // Appointment service unreachable/overloaded - degrade gracefully,
      // do not fail the whole dashboard.
      appointmentStats.error = "appointment-service unreachable";
    }

    res.json({
      totalPatients,
      admitted,
      outpatient,
      totalStaff,
      appointments: appointmentStats,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats };
