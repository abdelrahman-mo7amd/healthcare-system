import React from "react";
import { usePatient } from "../../hooks/usePatients.js";
import LoadingSpinner from "../Shared/LoadingSpinner.jsx";
import StatusBadge from "../Shared/StatusBadge.jsx";

// Modal-style record view: medical history + vitals timeline.
export default function PatientDetail({ patientId, onClose }) {
  const { data: patient, isLoading } = usePatient(patientId);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,36,59,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div className="card" style={{ width: 520, maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        {isLoading || !patient ? (
          <LoadingSpinner label="Loading record..." />
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0 }}>{patient.firstName} {patient.lastName}</h3>
                <div style={{ fontSize: 13, color: "var(--color-ink-soft)" }}>
                  {patient.gender} · Born {new Date(patient.dateOfBirth).toLocaleDateString()}
                </div>
              </div>
              <StatusBadge status={patient.status} />
            </div>

            <div style={{ margin: "16px 0" }}>
              <strong style={{ fontSize: 13 }}>Contact</strong>
              <div style={{ fontSize: 13, color: "var(--color-ink-soft)" }}>
                {patient.phone} {patient.email ? `· ${patient.email}` : ""}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <strong style={{ fontSize: 13 }}>Vitals history</strong>
              {patient.vitals?.length ? (
                <table style={{ marginTop: 6 }}>
                  <thead>
                    <tr><th>Date</th><th>BP</th><th>HR</th><th>Temp</th></tr>
                  </thead>
                  <tbody>
                    {patient.vitals.slice().reverse().map((v, i) => (
                      <tr key={i}>
                        <td>{new Date(v.recordedAt).toLocaleString()}</td>
                        <td>{v.bloodPressure}</td>
                        <td>{v.heartRate}</td>
                        <td>{v.temperature}°C</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ fontSize: 13, color: "var(--color-ink-soft)" }}>No vitals recorded yet.</div>
              )}
            </div>

            <button className="btn btn-outline" onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
}
