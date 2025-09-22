import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "@/features/auth/hooks";

export default function ProtectedRoute() {
  const { data: user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
}
