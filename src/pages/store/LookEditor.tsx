import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { listProducts } from "@/services/products";
import { createLook, addLookItem } from "@/services/looks";
import { formatPrice } from "@/lib/format";

export function LookEditorPage() {
  const store = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const productsState = useAsync(() => listProducts(store.$id, { limit: 200 }), [store.$id]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleProduct(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !name.trim() || selected.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      const look = await createLook(
        { storeId: store.$id, name: name.trim(), description: description.trim() },
        user.$id
      );
      for (let i = 0; i < selected.length; i++) {
        await addLookItem(look.$id, selected[i], i, user.$id);
      }
      navigate("/minha-loja/looks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o look.");
      setSaving(false);
    }
  }

  return (
    <div>
      <Link to="/minha-loja/looks" className="text-sm text-ink-soft hover:text-rose-700">
        ← Looks
      </Link>

      <h1 className="text-2xl mt-3 mb-8">Montar novo look</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label htmlFor="look-name" className="text-sm font-medium text-ink block mb-1.5">Nome do look</label>
          <input id="look-name" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" placeholder="Passeio no Parque" />
        </div>

        <div>
          <label htmlFor="look-desc" className="text-sm font-medium text-ink block mb-1.5">Descrição (opcional)</label>
          <textarea id="look-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input-field resize-none" />
        </div>

        <div>
          <span className="text-sm font-medium text-ink block mb-2">Escolha as peças do look</span>

          {productsState.status === "success" && productsState.data.length === 0 && (
            <EmptyState>
              Você ainda não tem peças cadastradas.{" "}
              <Link to="/minha-loja/produtos/novo" className="text-rose-700 underline">
                Cadastre uma peça primeiro
              </Link>
              .
            </EmptyState>
          )}

          {productsState.status === "success" && productsState.data.length > 0 && (
            <div className="space-y-2 max-h-80 overflow-y-auto border border-line rounded-xl p-3">
              {productsState.data.map((p) => (
                <label
                  key={p.$id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-blush-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(p.$id)}
                    onChange={() => toggleProduct(p.$id)}
                    className="accent-rose-600"
                  />
                  <span className="text-sm flex-1">{p.name}</span>
                  <span className="text-sm text-ink-soft">{formatPrice(p.price)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={saving || !name.trim() || selected.length === 0} size="lg">
          {saving ? "Salvando…" : "Salvar look"}
        </Button>
      </form>
    </div>
  );
}
