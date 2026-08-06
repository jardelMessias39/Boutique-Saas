import { useSearchParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { searchProducts } from "@/services/products";

export function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";
  const store = useStore();

  const state = useAsync(
    () => (query.trim() ? searchProducts(store.$id, query.trim()) : Promise.resolve([])),
    [store.$id, query]
  );

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Busca"
        title={query ? `Resultados para "${query}"` : "Buscar peças"}
      />

      {!query.trim() && (
        <EmptyState>Digite algo na busca do cabeçalho para encontrar peças.</EmptyState>
      )}

      {query.trim() && state.status === "loading" && <ProductGridSkeleton />}

      {query.trim() && state.status === "success" && state.data.length === 0 && (
        <EmptyState>Nenhuma peça encontrada para "{query}". Tente outro termo.</EmptyState>
      )}

      {query.trim() && state.status === "success" && state.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {state.data.map((p) => (
            <ProductCard key={p.$id} product={p} />
          ))}
        </div>
      )}
    </Container>
  );
}
