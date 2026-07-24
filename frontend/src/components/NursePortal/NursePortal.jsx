import React, { useState } from "react";
import { usePatients, useUpdatePatientStatus, useAddVitals } from "../../hooks/usePatients.js";
import LoadingSpinner from "../Shared/LoadingSpinner.jsx";
import StatusBadge from "../Shared/StatusBadge.jsx";

// Nurse Portal: patient status updates, medication/vitals tracking,
// ward management. Status changes use an OPTIMISTIC UI update via
// React Query -- the badge flips immediately, before the server
// confirms, so nurses aren't stuck waiting on network latency during
// a busy shift.
export default function NursePortal() {
  const [ward, setWard] = useState("");
  const patientsQuery = usePatients(ward ? { ward } : {});
  const updateStatus = useUpdatePatientStatus();
  const addVitals = useAddVitals();
  const [vitalsDraft, setVitalsDraft] = useState({});
  const [message, setMessage] = useState("");

  function submitVitals(id) {
    const draft = vitalsDraft[id] || {};
    addVitals.mutate(
      {
        id,
        bloodPressure: draft.bp || "120/80",
        heartRate: Number(draft.hr) || 70,
        temperature: Number(draft.temp) || 36.6,
        notes: draft.notes || "",
      },
      {
        onSuccess: () => {
          setMessage("Vitals recorded.");
          setVitalsDraft((d) => ({ ...d, [id]: {} }));
        },
      }
    );
  }

  if (patientsQuery.isLoading) return <LoadingSpinner label="Loading ward data..." />;
  const patients = patientsQuery.data || [];

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Nurse Portal</h2>

      <div className="card" style={{ marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-end" }}>
        <div style={{ maxWidth: 220 }}>
          <label>Filter by ward</label>
          <select value={ward} onChange={(e) => setWard(e.target.value)}>
            <option value="">All wards</option>
            <option value="Ward A">Ward A</option>
            <option value="Ward B">Ward B</option>
            <option value="ICU">ICU</option>
            <option value="Outpatient">Outpatient</option>
          </select>
        </div>
        {message && <div style={{ color: "var(--color-success)", fontSize: 13 }}>{message}</div>}
      </div>

      <div className="grid grid-2">
        {patients.map((p) => (
          <div key={p._id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{p.firstName} {p.lastName}</strong>
              <StatusBadge status={p.status} />
            </div>
            <div style={{ fontSize: 12, color: "var(--color-ink-soft)", margin: "4px 0 12px" }}>
              {p.ward} · Dr. {p.assignedDoctor?.name?.replace("Dr. ", "") || "Unassigned"}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["outpatient", "admitted", "discharged"].map((s) => (
                <button
                  key={s}
                  className="btn btn-outline"
                  style={{ fontSize: 12, padding: "6px 10px" }}
                  onClick={() => updateStatus.mutate({ id: p._id, status: s })}
                  disabled={p.status === s}
                >
                  Mark {s}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
              <input
                placeholder="BP e.g. 120/80"
                value={vitalsDraft[p._id]?.bp || ""}
                onChange={(e) =>
                  setVitalsDraft((d) => ({ ...d, [p._id]: { ...d[p._id], bp: e.target.value } }))
                }
              />
              <input
                placeholder="Heart rate"
                value={vitalsDraft[p._id]?.hr || ""}
                onChange={(e) =>
                  setVitalsDraft((d) => ({ ...d, [p._id]: { ...d[p._id], hr: e.target.value } }))
                }
              />
              <input
                placeholder="Temp °C"
                value={vitalsDraft[p._id]?.temp || ""}
                onChange={(e) =>
                  setVitalsDraft((d) => ({ ...d, [p._id]: { ...d[p._id], temp: e.target.value } }))
                }
              />
            </div>
            <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => submitVitals(p._id)}>
              Record vitals
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
