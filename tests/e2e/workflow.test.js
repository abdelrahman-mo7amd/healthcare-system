/**
 * End-to-end staff workflow test.
 *
 * Traces one real workflow across BOTH services against running
 * servers (not mocks): register a patient -> book their appointment
 * -> update their record -> confirm the dashboard numbers changed.
 *
 * Requires:
 *   - backend running on BACKEND_URL (default http://localhost:5000)
 *   - appointment-service running on APPOINTMENT_URL (default http://localhost:5001)
 *   - both pointed at a MongoDB instance
 *
 * Run with:  npm run test:e2e   (after `npm run dev` in another terminal)
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const APPOINTMENT_URL = process.env.APPOINTMENT_URL || "http://localhost:5001";

function assert(condition, message) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function json(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function run() {
  console.log("Step 1: register a doctor account and log in");
  const email = `e2e.doctor.${Date.now()}@hospital.test`;
  const register = await json(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name: "E2E Doctor", email, password: "password123", role: "doctor" }),
  });
  assert(register.status === 201, "doctor registration succeeds");
  const token = register.body.token;
  const authHeader = { Authorization: `Bearer ${token}` };

  console.log("Step 2: read baseline dashboard stats");
  const before = await json(`${BACKEND_URL}/api/dashboard/stats`, { headers: authHeader });
  assert(before.status === 200, "dashboard stats endpoint responds");
  const patientsBefore = before.body.totalPatients;

  console.log("Step 3: register a new patient");
  const patientRes = await json(`${BACKEND_URL}/api/patients`, {
    method: "POST",
    headers: authHeader,
    body: JSON.stringify({
      firstName: "E2E",
      lastName: "Patient",
      dateOfBirth: "1995-05-05",
      gender: "other",
      phone: "+201234567890",
    }),
  });
  assert(patientRes.status === 201, "patient is created");
  const patientId = patientRes.body._id;

  console.log("Step 4: book the patient's appointment on the independent microservice");
  const apptRes = await json(`${APPOINTMENT_URL}/api/appointments`, {
    method: "POST",
    headers: authHeader,
    body: JSON.stringify({
      patientId,
      patientName: "E2E Patient",
      doctorId: register.body.staff._id,
      doctorName: "E2E Doctor",
      scheduledAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      reason: "E2E workflow check",
    }),
  });
  assert(apptRes.status === 201, "appointment is booked on appointment-service");

  console.log("Step 5: update the patient's record (admit them)");
  const updateRes = await json(`${BACKEND_URL}/api/patients/${patientId}`, {
    method: "PUT",
    headers: authHeader,
    body: JSON.stringify({ status: "admitted", ward: "Ward A" }),
  });
  assert(updateRes.status === 200 && updateRes.body.status === "admitted", "patient record updated to admitted");

  console.log("Step 6: confirm dashboard numbers changed");
  const after = await json(`${BACKEND_URL}/api/dashboard/stats`, { headers: authHeader });
  assert(after.body.totalPatients === patientsBefore + 1, "total patient count incremented by one");
  assert(after.body.admitted >= before.body.admitted + 1, "admitted count incremented");

  console.log("\nAll workflow steps passed.");
}

run().catch((err) => {
  console.error("\nE2E WORKFLOW FAILED:", err.message);
  process.exit(1);
});
