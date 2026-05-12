import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ROLE_HOME = {
  admin: "/admin/dashboard",
  lecturer: "/lecturer/dashboard",
  student: "/dashboard",
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { isAuthenticated, role, restoringSession } = useAuth();

  if (restoringSession) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] ?? "/dashboard"} replace />;
  }

  return children;
}
