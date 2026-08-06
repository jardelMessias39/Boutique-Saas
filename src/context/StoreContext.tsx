import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getStoreBySlug } from "@/services/stores";
import type { Store } from "@/types/domain";

const ACTIVE_STORE_SLUG = import.meta.env.VITE_STORE_SLUG ?? "encantos-da-ana";

type StoreState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "ready"; store: Store };

interface StoreContextValue {
  state: StoreState;
  refresh: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue>({
  state: { status: "loading" },
  refresh: async () => {},
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>({ status: "loading" });

  const load = useCallback(async () => {
    try {
      const store = await getStoreBySlug(ACTIVE_STORE_SLUG);
      setState(store ? { status: "ready", store } : { status: "not-found" });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Erro ao carregar a loja.",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return <StoreContext.Provider value={{ state, refresh: load }}>{children}</StoreContext.Provider>;
}

/** Use apenas dentro de telas que já garantem status "ready" (ver StoreGate). */
export function useStore(): Store {
  const { state } = useContext(StoreContext);
  if (state.status !== "ready") {
    throw new Error("useStore() chamado antes da loja carregar — envolva a árvore com <StoreGate>.");
  }
  return state.store;
}

export function useStoreState() {
  return useContext(StoreContext).state;
}

/**
 * Recarrega os dados da loja a partir do Appwrite — chame depois de
 * qualquer alteração feita em Configurações ou Banner, pra refletir
 * no site sem precisar de F5.
 */
export function useRefreshStore() {
  return useContext(StoreContext).refresh;
}
