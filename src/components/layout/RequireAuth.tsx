import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-sm text-ink-soft animate-pulse">Carregando…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/minha-loja/login" replace />;
  }

  return <>{children}</>;
}
