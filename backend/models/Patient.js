const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema(
  {
    recordedAt: { type: Date, default: Date.now },
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    notes: String,
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    phone: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    address: { type: String },
    bloodType: { type: String },
    allergies: [{ type: String }],
    medicalHistory: [
      {
        condition: String,
        diagnosedOn: Date,
        notes: String,
      },
    ],
    ward: { type: String, default: "Outpatient" },
    status: {
      type: String,
      enum: ["admitted", "discharged", "outpatient"],
      default: "outpatient",
    },
    vitals: [vitalsSchema],
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
patientSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Patient", patientSchema);
