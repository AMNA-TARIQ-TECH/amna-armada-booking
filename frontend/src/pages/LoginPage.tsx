import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/AuthContext";

export function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="loading auth-loading">Loading...</div>;
  }

  return (
    <main className="auth-page">
      <LoginForm />
    </main>
  );
}
