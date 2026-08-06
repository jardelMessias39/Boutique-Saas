import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { listCategories, createCategory, deleteCategory } from "@/services/categories";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoriesPage() {
  const store = useStore();
  const { user } = useAuth();
  const state = useAsync(() => listCategories(store.$id), [store.$id]);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setSaving(true);
    await createCategory(
      { storeId: store.$id, name: name.trim(), slug: slugify(name), position: 0 },
      user.$id
    );
    setName("");
    setSaving(false);
    window.location.reload();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remover a categoria "${name}"? Produtos que usam essa categoria não serão apagados, mas ficarão sem categoria.`)) return;
    await deleteCategory(id);
    window.location.reload();
  }

  return (
    <div>
      <h1 className="text-2xl mb-8">Categorias</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-8 max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da categoria (ex: Vestidos)"
          className="input-field"
        />
        <Button type="submit" disabled={saving || !name.trim()}>
          Criar
        </Button>
      </form>

      {state.status === "success" && state.data.length === 0 && (
        <EmptyState>Nenhuma categoria criada ainda. Crie a primeira acima (ex: Vestidos, Calçados, Bolsas, Tiaras).</EmptyState>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <div className="space-y-2 max-w-md">
          {state.data.map((c) => (
            <div key={c.$id} className="flex items-center justify-between rounded-xl border border-line bg-white/60 px-4 py-3">
              <span className="text-sm font-medium">{c.name}</span>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(c.$id, c.name)} className="text-danger">
                Excluir
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
