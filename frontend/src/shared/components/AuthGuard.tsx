import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;
  return <>{children}</>;
}
