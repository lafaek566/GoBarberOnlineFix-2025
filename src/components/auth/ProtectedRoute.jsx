import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role, allowedRoles }) => {
  if (!role) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
