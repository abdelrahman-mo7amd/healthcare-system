import React, { useState } from "react";
import { usePatients } from "../../hooks/usePatients.js";
import LoadingSpinner from "../Shared/LoadingSpinner.jsx";
import StatusBadge from "../Shared/StatusBadge.jsx";
import PatientForm from "./PatientForm.jsx";
import PatientDetail from "./PatientDetail.jsx";

// Patient Management: add/edit patient form, medical history view,
// record updates. List + search are backed by React Query, so
// switching tabs and coming back doesn't re-fetch unnecessarily.
export default function PatientList() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const patientsQuery = usePatients(debouncedSearch ? { search: debouncedSearch } : {});

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Patient Management</h2>

      <PatientForm />

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>All patients</h3>
          <input
            placeholder="Search by name or phone..."
            style={{ maxWidth: 260 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {patientsQuery.isLoading ? (
          <LoadingSpinner label="Loading patients..." />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Ward</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(patientsQuery.data || []).map((p) => (
                <tr key={p._id}>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>{p.phone}</td>
                  <td>{p.ward}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <button className="btn btn-outline" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => setSelected(p._id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && <PatientDetail patientId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
