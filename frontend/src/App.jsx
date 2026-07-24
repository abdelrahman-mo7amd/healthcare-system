import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Shared/Navbar.jsx";
import AuthGuard from "./components/Shared/AuthGuard.jsx";
import ErrorBoundary from "./components/Shared/ErrorBoundary.jsx";
import Login from "./pages/Login.jsx";
import DoctorDashboard from "./components/DoctorDashboard/DoctorDashboard.jsx";
import NursePortal from "./components/NursePortal/NursePortal.jsx";
import PatientList from "./components/PatientManagement/PatientList.jsx";
import AppointmentCalendar from "./components/AppointmentSystem/AppointmentCalendar.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <AuthGuard>
              <div className="app-shell">
                <Navbar />
                <main className="app-main">
                  <Routes>
                    <Route index element={<DoctorDashboard />} />
                    <Route path="nurse" element={<NursePortal />} />
                    <Route path="patients" element={<PatientList />} />
                    <Route path="appointments" element={<AppointmentCalendar />} />
                  </Routes>
                </main>
              </div>
            </AuthGuard>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}
