import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.status === "Pending" && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  if (user.status !== "Pending" && location.pathname === "/change-password") {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
