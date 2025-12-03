// src/components/Admin.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminPanel from "./AdminPanel";

// Zaštita ruta
function ProtectedRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/prijava" replace />;
}

export default function Admin() {
  return (
    <div className="admin-page">
      <Routes>
        {/* Zaštićene admin rute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminPanel />} />
          <Route path="panel" element={<AdminPanel />} />
        </Route>

        {/* Ako admin ruta ne postoji → vrati na /admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
}
