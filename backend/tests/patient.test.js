/**
 * Basic integration test for backend routes.
 * Requires a running MongoDB instance reachable via MONGO_URI (test db).
 */
process.env.MONGO_URI = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/healthcare_test";
process.env.JWT_SECRET = "test_secret";

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const connectDB = require("../config/db");

let token;

beforeAll(async () => {
  await connectDB();
  const email = `test.doctor.${Date.now()}@hospital.test`;
  const res = await request(app).post("/api/auth/register").send({
    name: "Test Doctor",
    email,
    password: "password123",
    role: "doctor",
  });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("Patient workflow", () => {
  let patientId;

  it("creates a patient", async () => {
    const res = await request(app)
      .post("/api/patients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        gender: "female",
        phone: "+201000000000",
      });
    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    patientId = res.body._id;
  });

  it("lists patients", async () => {
    const res = await request(app)
      .get("/api/patients")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("updates a patient record", async () => {
    const res = await request(app)
      .put(`/api/patients/${patientId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "admitted", ward: "Ward A" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("admitted");
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/patients");
    expect(res.status).toBe(401);
  });
});
