const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Cross-service references are stored as plain IDs (+ denormalized
    // display fields), never as Mongoose refs into the other service's
    // database -- the two services do not share a database.
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    department: { type: String },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    reason: { type: String },
    status: {
      type: String,
      enum: ["booked", "confirmed", "completed", "cancelled", "no-show"],
      default: "booked",
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ scheduledAt: 1 });
appointmentSchema.index({ doctorId: 1, scheduledAt: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
