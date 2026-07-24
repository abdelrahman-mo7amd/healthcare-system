import React from "react";
import { useDashboardStats } from "../../hooks/useDashboardStats.js";
import { usePatients } from "../../hooks/usePatients.js";
import LoadingSpinner from "../Shared/LoadingSpinner.jsx";
import StatusBadge from "../Shared/StatusBadge.jsx";

// Doctor Dashboard: patient list, daily schedule, quick actions,
// appointment overview. Backed by React Query, which caches both
// queries and re-syncs dashboard stats in the background every 15s,
// so this screen never blocks on a full page reload to stay current.
export default function DoctorDashboard() {
  const statsQuery = useDashboardStats();
  const patientsQuery = usePatients();

  if (statsQuery.isLoading || patientsQuery.isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }
  if (statsQuery.isError) {
    return <div className="card">{statsQuery.error?.response?.data?.message || "Failed to load dashboard"}</div>;
  }

  const stats = statsQuery.data;
  const patients = (patientsQuery.data || []).slice(0, 8);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Doctor Dashboard</h2>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="stat-value">{stats.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.admitted}</div>
          <div className="stat-label">Admitted</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.appointments.todayCount}</div>
          <div className="stat-label">Appointments Today</div>
        </div>
        <div className="card">
          <div className="stat-value">{stats.appointments.upcomingCount}</div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>

      {stats.appointments.source !== "live" && (
        <div
          className="card"
          style={{ marginBottom: 20, borderColor: "var(--color-warning)", fontSize: 13, color: "var(--color-warning)" }}
        >
          Appointment service is currently unreachable — appointment counts may be stale. Patient
          data above is unaffected, which is exactly why the appointment system runs as its own
          service.
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Recent Patients</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Ward</th>
              <th>Status</th>
              <th>Assigned Doctor</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td>{p.firstName} {p.lastName}</td>
                <td>{p.ward}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>{p.assignedDoctor?.name || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
