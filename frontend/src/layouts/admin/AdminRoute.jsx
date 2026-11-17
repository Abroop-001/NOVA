import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  let role = null;

  // 1. Read role from stored user session
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      role = parsed?.role;
    }
  } catch (err) {
    role = null;
  }

  // 2. Fallback to decoding role from JWT payload
  if (!role && token) {
    try {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64));
        role = decoded?.role;
      }
    } catch (err) {
      role = null;
    }
  }

  // Authorize both admin and superadmin
  const isAuthorized = role === "admin" || role === "superadmin";

  if (!isAuthorized) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;

