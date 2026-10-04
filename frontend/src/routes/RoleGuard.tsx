import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type Props = {
  allowedRoles?: string[];
};

export default function RoleGuard({ allowedRoles = ["admin", "operator"] }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <span className="text-[#C9A84C] font-mono">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
