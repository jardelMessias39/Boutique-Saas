import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { listProducts, deleteProduct, updateProduct } from "@/services/products";
import { listCategories } from "@/services/categories";
import { recordSale } from "@/services/sales";
import { formatPrice, STATUS_LABELS, STATUS_STYLES } from "@/lib/format";

export function ProductsPage() {
  const store = useStore();
  const { user } = useAuth();
  const state = useAsync(() => listProducts(store.$id, { limit: 200 }), [store.$id]);
  const categoriesState = useAsync(() => listCategories(store.$id), [store.$id]);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remover "${name}"? Essa ação não pode ser desfeita.`)) return;
    await deleteProduct(id);
    window.location.reload();
  }

  async function handleMarkAsSold(id: string) {
    if (!user || state.status !== "success") return;
    const product = state.data.find((p) => p.$id === id);
    if (!product) return;

    setBusyId(id);
    const category =
      categoriesState.status === "success"
        ? categoriesState.data.find((c) => c.$id === product.categoryId) ?? null
        : null;

    await updateProduct(id, { status: "vendido" });
    await recordSale({ ...product, status: "vendido" }, category, user.$id);
    window.location.reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Produtos</h1>
        <Link to="/minha-loja/produtos/novo">
          <Button size="sm">+ Nova peça</Button>
        </Link>
      </div>

      {state.status === "loading" && <p className="text-sm text-ink-soft">Carregando…</p>}

      {state.status === "success" && state.data.length === 0 && (
        <EmptyState>
          Nenhuma peça cadastrada ainda.{" "}
          <Link to="/minha-loja/produtos/novo" className="text-rose-700 underline">
            Cadastre a primeira
          </Link>
          .
        </EmptyState>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <div className="space-y-2">
          {state.data.map((p) => (
            <div
              key={p.$id}
              className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white/60 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink truncate">{p.name}</p>
                <p className="text-sm text-ink-soft">
                  {formatPrice(p.price)} · {p.size || "—"}
                </p>
              </div>
              <span className={`label-caps px-2 py-1 rounded-md shrink-0 ${STATUS_STYLES[p.status]}`}>
                {STATUS_LABELS[p.status]}
              </span>
              <div className="flex gap-2 shrink-0">
                {p.status !== "vendido" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsSold(p.$id)}
                    disabled={busyId === p.$id}
                    className="text-success"
                  >
                    {busyId === p.$id ? "Marcando…" : "Marcar como vendido"}
                  </Button>
                )}
                <Link to={`/minha-loja/produtos/${p.$id}/editar`}>
                  <Button variant="ghost" size="sm">Editar</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(p.$id, p.name)} className="text-danger">
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
