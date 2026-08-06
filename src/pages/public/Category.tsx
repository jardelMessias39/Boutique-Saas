import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductGridSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { getCategoryBySlug } from "@/services/categories";
import { listProducts } from "@/services/products";

const COMMON_SIZES = ["RN", "P", "M", "G", "2 anos", "4 anos", "6 anos", "8 anos", "10 anos", "12 anos"];

export function CategoryPage() {
  const { slug = "" } = useParams();
  const store = useStore();
  const [size, setSize] = useState<string | null>(null);

  const categoryState = useAsync(() => getCategoryBySlug(store.$id, slug), [store.$id, slug]);

  return (
    <Container className="py-16">
      {categoryState.status === "loading" && (
        <p className="text-center text-sm text-ink-soft">Carregando categoria…</p>
      )}

      {categoryState.status === "success" && categoryState.data === null && (
        <EmptyState>
          Essa categoria ainda não foi criada pela loja. Assim que for cadastrada em{" "}
          <strong>Minha Loja → Categorias</strong>, ela aparece aqui.
        </EmptyState>
      )}

      {categoryState.status === "success" && categoryState.data && (
        <>
          <PageHeader eyebrow="Categoria" title={categoryState.data.name} />

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <SizeChip label="Todos os tamanhos" active={size === null} onClick={() => setSize(null)} />
            {COMMON_SIZES.map((s) => (
              <SizeChip key={s} label={s} active={size === s} onClick={() => setSize(s)} />
            ))}
          </div>

          <ProductList storeId={store.$id} categoryId={categoryState.data.$id} size={size} />
        </>
      )}
    </Container>
  );
}

function SizeChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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

function ProductList({
  storeId,
  categoryId,
  size,
}: {
  storeId: string;
  categoryId: string;
  size: string | null;
}) {
  const state = useAsync(
    () => listProducts(storeId, { categoryId, size: size ?? undefined, limit: 48 }),
    [storeId, categoryId, size]
  );

  if (state.status === "loading") return <ProductGridSkeleton />;

  if (state.status === "error") {
    return <p className="text-center text-sm text-danger">Não foi possível carregar os produtos agora.</p>;
  }

  if (state.data.length === 0) {
    return (
      <EmptyState>
        {size
          ? `Nenhuma peça encontrada no tamanho "${size}" nessa categoria.`
          : "Nenhuma peça cadastrada nessa categoria ainda."}{" "}
        <Link to="/novidades" className="text-rose-700 underline">
          Ver todas as novidades
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {state.data.map((product) => (
        <ProductCard key={product.$id} product={product} />
      ))}
    </div>
  );
}
