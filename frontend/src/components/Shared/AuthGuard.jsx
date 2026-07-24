import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function AuthGuard({ children, roles }) {
  const { staff, loading } = useAuth();

  if (loading) return <LoadingSpinner label="Checking session..." />;
  if (!staff) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(staff.role)) {
    return (
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Access restricted</h3>
        <p style={{ color: "var(--color-ink-soft)" }}>
          Your role ({staff.role}) doesn't have access to this page.
        </p>
      </div>
    );
  }
  return children;
}
