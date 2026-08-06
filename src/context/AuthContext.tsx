import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Models } from "appwrite";
import { getCurrentUser, login as loginService, logout as logoutService, register as registerService } from "@/services/auth";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    await loginService(email, password);
    setUser(await getCurrentUser());
  }

  async function register(name: string, email: string, password: string) {
    await registerService(name, email, password);
    setUser(await getCurrentUser());
  }

  async function logout() {
    await logoutService();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() precisa estar dentro de <AuthProvider>.");
  return ctx;
}
