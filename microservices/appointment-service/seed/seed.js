require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Appointment = require("../models/Appointment");

const doctors = [
  { doctorId: "seed-doctor-amina", doctorName: "Dr. Amina Hassan", department: "Cardiology" },
  { doctorId: "seed-doctor-karim", doctorName: "Dr. Karim Youssef", department: "Pediatrics" },
];

const patientNames = ["Sara Ibrahim", "Omar Fahmy", "Layla Aziz", "Ahmed Naguib", "Mona Saleh"];

function buildAppointments() {
  const list = [];
  const now = new Date();
  for (let i = 0; i < 20; i++) {
    const doc = doctors[i % doctors.length];
    const date = new Date(now);
    date.setDate(date.getDate() + (i % 7) - 2);
    date.setHours(9 + (i % 8), 0, 0, 0);
    list.push({
      patientId: `seed-patient-${i}`,
      patientName: patientNames[i % patientNames.length],
      doctorId: doc.doctorId,
      doctorName: doc.doctorName,
      department: doc.department,
      scheduledAt: date,
      reason: ["Checkup", "Follow-up", "Consultation", "Vaccination"][i % 4],
      status: ["booked", "confirmed", "completed"][i % 3],
    });
  }
  return list;
}

async function seed() {
  await connectDB();
  console.log("[seed] Clearing appointments...");
  await Appointment.deleteMany({});
  console.log("[seed] Inserting appointments...");
  await Appointment.insertMany(buildAppointments());
  console.log("[seed] Done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
