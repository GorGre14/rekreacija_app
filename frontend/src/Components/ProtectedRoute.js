import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../Context/AppContext";

export default function ProtectedRoute({ children }) {
  const { user } = useApp();
  const loc = useLocation();
  if (!user)
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}
