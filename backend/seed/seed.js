require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Staff = require("../models/Staff");
const Patient = require("../models/Patient");

const staffSeed = [
  { name: "Dr. Amina Hassan", email: "amina.doctor@hospital.test", password: "password123", role: "doctor", department: "Cardiology" },
  { name: "Dr. Karim Youssef", email: "karim.doctor@hospital.test", password: "password123", role: "doctor", department: "Pediatrics" },
  { name: "Nour El-Sayed", email: "nour.nurse@hospital.test", password: "password123", role: "nurse", department: "General Ward", ward: "Ward A" },
  { name: "Admin User", email: "admin@hospital.test", password: "password123", role: "admin", department: "Administration" },
];

function randomPatients(doctorIds) {
  const first = ["Sara", "Omar", "Layla", "Ahmed", "Mona", "Hassan", "Yara", "Tarek", "Nadia", "Fady"];
  const last = ["Ibrahim", "Fahmy", "Aziz", "Naguib", "Saleh", "Mahmoud", "Rashid", "Kamal"];
  const wards = ["Outpatient", "Ward A", "Ward B", "ICU"];
  const statuses = ["admitted", "discharged", "outpatient"];
  const patients = [];
  for (let i = 0; i < 25; i++) {
    patients.push({
      firstName: first[i % first.length],
      lastName: last[(i * 3) % last.length],
      dateOfBirth: new Date(1950 + (i % 60), i % 12, (i % 27) + 1),
      gender: i % 2 === 0 ? "male" : "female",
      phone: `+2010${(10000000 + i * 137).toString().slice(0, 8)}`,
      email: `patient${i}@example.test`,
      bloodType: ["A+", "O+", "B+", "AB+", "O-"][i % 5],
      allergies: i % 4 === 0 ? ["Penicillin"] : [],
      ward: wards[i % wards.length],
      status: statuses[i % statuses.length],
      assignedDoctor: doctorIds[i % doctorIds.length],
      medicalHistory:
        i % 3 === 0
          ? [
              {
                condition: ["Hypertension", "Type 2 Diabetes", "Asthma"][i % 3],
                diagnosedOn: new Date(2015 + (i % 8), i % 12, 1),
                notes: "Managed with routine follow-ups; no acute complications recorded.",
              },
            ]
          : [],
      vitals: [
        {
          bloodPressure: "120/80",
          heartRate: 60 + (i % 40),
          temperature: 36.5 + (i % 3) * 0.3,
          notes: "Routine checkup, stable.",
        },
      ],
    });
  }
  return patients;
}

async function seed() {
  await connectDB();
  console.log("[seed] Clearing existing collections...");
  await Promise.all([Staff.deleteMany({}), Patient.deleteMany({})]);

  console.log("[seed] Inserting staff...");
  const staff = await Staff.create(staffSeed);
  const doctorIds = staff.filter((s) => s.role === "doctor").map((s) => s._id);

  console.log("[seed] Inserting patients...");
  await Patient.insertMany(randomPatients(doctorIds));

  console.log("[seed] Done. Sample login: amina.doctor@hospital.test / password123");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
