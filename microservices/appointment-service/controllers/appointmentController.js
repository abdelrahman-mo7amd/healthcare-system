const Appointment = require("../models/Appointment");

async function createAppointment(req, res, next) {
  try {
    const appt = await Appointment.create(req.body);
    res.status(201).json(appt);
  } catch (err) {
    next(err);
  }
}

async function listAppointments(req, res, next) {
  try {
    const { doctorId, patientId, status, from, to } = req.query;
    const filter = {};
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;
    if (from || to) {
      filter.scheduledAt = {};
      if (from) filter.scheduledAt.$gte = new Date(from);
      if (to) filter.scheduledAt.$lte = new Date(to);
    }
    const appts = await Appointment.find(filter).sort({ scheduledAt: 1 });
    res.json(appts);
  } catch (err) {
    next(err);
  }
}

async function getAppointment(req, res, next) {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (err) {
    next(err);
  }
}

async function updateAppointment(req, res, next) {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (err) {
    next(err);
  }
}

async function cancelAppointment(req, res, next) {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (err) {
    next(err);
  }
}

// Lightweight aggregate endpoint the primary backend polls for the
// dashboard. Kept cheap on purpose so it stays fast even while the
// booking endpoints are under heavy load.
async function getStats(req, res, next) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [todayCount, upcomingCount] = await Promise.all([
      Appointment.countDocuments({ scheduledAt: { $gte: startOfDay, $lte: endOfDay } }),
      Appointment.countDocuments({ scheduledAt: { $gt: endOfDay }, status: { $in: ["booked", "confirmed"] } }),
    ]);

    res.json({ todayCount, upcomingCount });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAppointment,
  listAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  getStats,
};
