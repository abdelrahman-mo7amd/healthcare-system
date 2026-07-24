import React, { useState } from "react";
import { useBookAppointment } from "../../hooks/useAppointments.js";

// Booking uses an OPTIMISTIC UI update: the new appointment is added
// to the cached list immediately (see useBookAppointment), so it
// appears in the table below before the server has even responded.
export default function AppointmentBooking() {
  const bookAppointment = useBookAppointment();
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    department: "",
    scheduledAt: "",
    reason: "",
  });
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    bookAppointment.mutate(
      { ...form, scheduledAt: new Date(form.scheduledAt).toISOString() },
      {
        onSuccess: () => {
          setForm({
            patientId: "",
            patientName: "",
            doctorId: "",
            doctorName: "",
            department: "",
            scheduledAt: "",
            reason: "",
          });
        },
        onError: (err) => setError(err.response?.data?.message || "Booking failed"),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>Book appointment</h3>
      <div className="grid grid-3" style={{ marginBottom: 12 }}>
        <div>
          <label>Patient ID</label>
          <input required value={form.patientId} onChange={(e) => set("patientId", e.target.value)} />
        </div>
        <div>
          <label>Patient name</label>
          <input required value={form.patientName} onChange={(e) => set("patientName", e.target.value)} />
        </div>
        <div>
          <label>Doctor ID</label>
          <input required value={form.doctorId} onChange={(e) => set("doctorId", e.target.value)} />
        </div>
        <div>
          <label>Doctor name</label>
          <input required value={form.doctorName} onChange={(e) => set("doctorName", e.target.value)} />
        </div>
        <div>
          <label>Department</label>
          <input value={form.department} onChange={(e) => set("department", e.target.value)} />
        </div>
        <div>
          <label>Date &amp; time</label>
          <input required type="datetime-local" value={form.scheduledAt} onChange={(e) => set("scheduledAt", e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Reason for visit</label>
        <input value={form.reason} onChange={(e) => set("reason", e.target.value)} />
      </div>
      {error && <div style={{ color: "var(--color-danger)", fontSize: 13, marginBottom: 10 }}>{error}</div>}
      <button className="btn btn-primary" disabled={bookAppointment.isPending}>
        {bookAppointment.isPending ? "Booking..." : "Confirm booking"}
      </button>
    </form>
  );
}
