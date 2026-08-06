import type { ReactNode } from "react";
import { useStoreState } from "@/context/StoreContext";
import { Container } from "@/components/ui/Container";

export function StoreGate({ children }: { children: ReactNode }) {
  const state = useStoreState();

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-ink-soft text-sm animate-pulse">Carregando a loja…</p>
      </div>
    );
  }

  if (state.status === "not-found") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Container className="max-w-md text-center py-20">
          <h1 className="text-2xl mb-3">Loja não encontrada</h1>
          <p className="text-sm text-ink-soft leading-relaxed">
            Nenhuma loja foi encontrada com o slug configurado. Isso é
            esperado se você ainda não criou o registro da loja na tabela{" "}
            <code className="bg-blush-100 px-1.5 py-0.5 rounded text-rose-700">stores</code>{" "}
            do Appwrite. Crie uma linha lá com o campo{" "}
            <code className="bg-blush-100 px-1.5 py-0.5 rounded text-rose-700">slug</code>{" "}
            igual ao configurado em <code className="bg-blush-100 px-1.5 py-0.5 rounded text-rose-700">VITE_STORE_SLUG</code>{" "}
            (padrão: <code className="bg-blush-100 px-1.5 py-0.5 rounded text-rose-700">encantos-da-ana</code>).
          </p>
        </Container>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Container className="max-w-md text-center py-20">
          <h1 className="text-2xl mb-3 text-danger">Não foi possível carregar a loja</h1>
          <p className="text-sm text-ink-soft">{state.message}</p>
        </Container>
      </div>
    );
  }

  return <>{children}</>;
}
