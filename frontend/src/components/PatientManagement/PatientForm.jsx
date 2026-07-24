import React, { useState } from "react";
import { useCreatePatient } from "../../hooks/usePatients.js";

export default function PatientForm() {
  const createPatient = useCreatePatient();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "female",
    phone: "",
    email: "",
    ward: "Outpatient",
  });
  const [error, setError] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    createPatient.mutate(form, {
      onSuccess: () => {
        setForm({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "female",
          phone: "",
          email: "",
          ward: "Outpatient",
        });
      },
      onError: (err) => setError(err.response?.data?.message || "Could not create patient"),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
      <h3 style={{ marginTop: 0 }}>Register new patient</h3>
      <div className="grid grid-3" style={{ marginBottom: 12 }}>
        <div>
          <label>First name</label>
          <input required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        </div>
        <div>
          <label>Last name</label>
          <input required value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
        </div>
        <div>
          <label>Date of birth</label>
          <input required type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
        </div>
        <div>
          <label>Gender</label>
          <select value={form.gender} onChange={(e) => set("gender", e.target.value)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Phone</label>
          <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label>Ward</label>
          <select value={form.ward} onChange={(e) => set("ward", e.target.value)}>
            <option>Outpatient</option>
            <option>Ward A</option>
            <option>Ward B</option>
            <option>ICU</option>
          </select>
        </div>
      </div>
      {error && <div style={{ color: "var(--color-danger)", fontSize: 13, marginBottom: 10 }}>{error}</div>}
      <button className="btn btn-primary" disabled={createPatient.isPending}>
        {createPatient.isPending ? "Saving..." : "Register patient"}
      </button>
    </form>
  );
}
