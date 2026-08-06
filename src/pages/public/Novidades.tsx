import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { listCategories } from "@/services/categories";
import { listProducts } from "@/services/products";

export function NoveltiesPage() {
  const store = useStore();
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const categoriesState = useAsync(() => listCategories(store.$id), [store.$id]);
  const productsState = useAsync(
    () => listProducts(store.$id, { categoryId: categoryId ?? undefined, limit: 48 }),
    [store.$id, categoryId]
  );

  return (
    <Container className="py-16">
      <PageHeader eyebrow="Recém-chegadas" title="Novidades" />

      {categoriesState.status === "success" && categoriesState.data.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <FilterChip label="Todas" active={categoryId === null} onClick={() => setCategoryId(null)} />
          {categoriesState.data.map((c) => (
            <FilterChip
              key={c.$id}
              label={c.name}
              active={categoryId === c.$id}
              onClick={() => setCategoryId(c.$id)}
            />
          ))}
        </div>
      )}

      {productsState.status === "loading" && <ProductGridSkeleton count={10} />}

      {productsState.status === "success" && productsState.data.length === 0 && (
        <EmptyState>
          Nenhuma peça cadastrada ainda. Assim que a primeira peça for cadastrada em{" "}
          <strong>Minha Loja → Produtos</strong>, ela aparece aqui.
        </EmptyState>
      )}

      {productsState.status === "success" && productsState.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {productsState.data.map((p) => (
            <ProductCard key={p.$id} product={p} />
          ))}
        </div>
      )}
    </Container>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
        active
          ? "bg-rose-600 text-cream border-rose-600"
          : "bg-transparent text-ink-soft border-line hover:border-rose-400"
      }`}
    >
      {label}
    </button>
  );
}
