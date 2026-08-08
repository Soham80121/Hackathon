import React from "react";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import HRDashboard from "./HRDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;

  if (userRole === "admin") {
    return <AdminDashboard />;
  } else if (userRole === "hr") {
    return <HRDashboard />;
  } else {
    return <EmployeeDashboard />;
  }
}
