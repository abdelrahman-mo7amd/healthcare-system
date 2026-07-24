import React from "react";
import { useAppointments, useCancelAppointment } from "../../hooks/useAppointments.js";
import LoadingSpinner from "../Shared/LoadingSpinner.jsx";
import StatusBadge from "../Shared/StatusBadge.jsx";
import AppointmentBooking from "./AppointmentBooking.jsx";

// Appointment System: booking form, calendar/list view, confirmation
// UI, status badges. Cached via React Query and talks to the
// standalone appointment-service, never the primary backend.
export default function AppointmentCalendar() {
  const appointmentsQuery = useAppointments();
  const cancelAppointment = useCancelAppointment();

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Appointment System</h2>

      <AppointmentBooking />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Scheduled appointments</h3>
        {appointmentsQuery.isLoading ? (
          <LoadingSpinner label="Loading appointments..." />
        ) : appointmentsQuery.isError ? (
          <div style={{ color: "var(--color-danger)" }}>
            {appointmentsQuery.error?.response?.data?.message || "Could not reach appointment service"}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>When</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Reason</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {appointmentsQuery.data.map((a) => (
                <tr key={a._id}>
                  <td>{new Date(a.scheduledAt).toLocaleString()}</td>
                  <td>{a.patientName}</td>
                  <td>{a.doctorName}</td>
                  <td>{a.reason || "—"}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    {a.status !== "cancelled" && (
                      <button
                        className="btn btn-outline"
                        style={{ fontSize: 12, padding: "5px 10px" }}
                        onClick={() => cancelAppointment.mutate(a._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
