import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";

export function LoginPage() {
  const { user, loading, login, register } = useAuth();
  const store = useStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/minha-loja" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/minha-loja");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar. Confira seus dados.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-deep">
      <Container className="max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block">
            <Logo storeName={store.name} logoUrl={store.logoUrl} />
          </div>
        </div>

        <div className="bg-cream border border-line rounded-2xl p-7 shadow-[var(--shadow-soft)]">
          <h1 className="text-xl text-center mb-1">
            {mode === "login" ? "Entrar em Minha Loja" : "Criar sua conta"}
          </h1>
          <p className="text-sm text-ink-soft text-center mb-6">
            {mode === "login"
              ? "Acesse o painel para gerenciar sua loja."
              : "Primeiro acesso? Crie sua conta de dona da loja."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <Field label="Seu nome" htmlFor="name">
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Ana"
                />
              </Field>
            )}

            <Field label="E-mail" htmlFor="email">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="voce@email.com"
              />
            </Field>

            <Field label="Senha" htmlFor="password">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="input-field"
                placeholder="Mínimo 8 caracteres"
              />
            </Field>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>

          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-center text-sm text-rose-700 mt-5 hover:underline"
          >
            {mode === "login" ? "Primeiro acesso? Criar conta" : "Já tem conta? Entrar"}
          </button>
        </div>
      </Container>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
