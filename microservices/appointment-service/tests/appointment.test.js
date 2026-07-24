process.env.MONGO_URI = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/healthcare_appointments_test";
process.env.JWT_SECRET = "test_secret";

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../server");
const connectDB = require("../config/db");

let token;

beforeAll(async () => {
  await connectDB();
  token = jwt.sign({ id: "test-staff-id", role: "doctor" }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("Appointment workflow", () => {
  let appointmentId;

  it("books an appointment", async () => {
    const res = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        patientId: "p1",
        patientName: "Jane Doe",
        doctorId: "d1",
        doctorName: "Dr. Test",
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        reason: "Checkup",
      });
    expect(res.status).toBe(201);
    appointmentId = res.body._id;
  });

  it("returns dashboard stats without auth", async () => {
    const res = await request(app).get("/api/appointments/stats");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("todayCount");
  });

  it("cancels an appointment", async () => {
    const res = await request(app)
      .post(`/api/appointments/${appointmentId}/cancel`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("cancelled");
  });
});
