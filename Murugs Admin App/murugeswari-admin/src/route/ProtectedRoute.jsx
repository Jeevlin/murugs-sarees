import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAIL } from "../config";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  // ⏳ wait until Firebase checks login
  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ not admin
  if (user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  // ✅ allowed
  return <Outlet />;  // 🔥 THIS FIXES EVERYTHING
}

export default ProtectedRoute;