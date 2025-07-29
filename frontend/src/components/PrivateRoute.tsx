import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

const PrivateRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;