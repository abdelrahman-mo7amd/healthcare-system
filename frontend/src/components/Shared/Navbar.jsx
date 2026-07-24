import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  color: isActive ? "#fff" : "var(--color-ink-soft)",
  background: isActive ? "var(--color-primary)" : "transparent",
  marginBottom: 4,
  textDecoration: "none",
});

export default function Navbar() {
  const { staff, logout } = useAuth();
  const navigate = useNavigate();

  if (!staff) return null;

  return (
    <nav
      style={{
        width: 220,
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "0 8px 20px" }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: "var(--color-primary-dark)" }}>MediCore</div>
        <div style={{ fontSize: 12, color: "var(--color-ink-soft)" }}>Hospital System</div>
      </div>

      <NavLink to="/" end style={linkStyle}>Doctor Dashboard</NavLink>
      <NavLink to="/nurse" style={linkStyle}>Nurse Portal</NavLink>
      <NavLink to="/patients" style={linkStyle}>Patients</NavLink>
      <NavLink to="/appointments" style={linkStyle}>Appointments</NavLink>

      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--color-border)" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{staff.name}</div>
        <div style={{ fontSize: 12, color: "var(--color-ink-soft)", marginBottom: 10, textTransform: "capitalize" }}>
          {staff.role}
        </div>
        <button
          className="btn btn-outline"
          style={{ width: "100%" }}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
