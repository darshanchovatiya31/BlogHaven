import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};


export const PrivateRouteotp = ({ children }) => {
  const token = localStorage.getItem("isotp");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export const PrivateRouteadmin = () => {
  const token = localStorage.getItem("admintoken");
  return token ? <Outlet /> : <Navigate to="/admin/login" />;
};