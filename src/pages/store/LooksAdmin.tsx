import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { listLooks, listLookProducts } from "@/services/looks";
import { listProductImages } from "@/services/products";
import { getFileUrl } from "@/lib/storage";
import type { Look } from "@/types/domain";

export function LooksAdminPage() {
  const store = useStore();
  const state = useAsync(() => listLooks(store.$id), [store.$id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl">Looks</h1>
        <Link to="/minha-loja/looks/novo">
          <Button size="sm">+ Montar look</Button>
        </Link>
      </div>

      {state.status === "success" && state.data.length === 0 && (
        <EmptyState>
          Nenhum look montado ainda.{" "}
          <Link to="/minha-loja/looks/novo" className="text-rose-700 underline">
            Monte o primeiro
          </Link>
          .
        </EmptyState>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {state.data.map((look) => (
            <AdminLookCard key={look.$id} look={look} />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminLookCard({ look }: { look: Look }) {
  // Se não houver capa definida, usa a foto do primeiro produto do look —
  // mesma lógica usada no site público (LookCard), pra não precisar de
  // upload manual de capa.
  const fallbackState = useAsync(async () => {
    if (look.coverImageUrl) return null;
    const products = await listLookProducts(look.$id);
    if (products.length === 0) return null;
    const images = await listProductImages(products[0].$id);
    return images[0]?.url ?? null;
  }, [look.$id, look.coverImageUrl]);

  const imageId = look.coverImageUrl ?? (fallbackState.status === "success" ? fallbackState.data : null);

  return (
    <div className="rounded-xl border border-line bg-white/60 overflow-hidden">
      <div className="aspect-video bg-blush-50">
        {imageId ? (
          <img src={getFileUrl(imageId)} alt={look.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-ink-soft/60">
            Sem foto ainda
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-medium">{look.name}</p>
        {look.description && <p className="text-sm text-ink-soft mt-1">{look.description}</p>}
      </div>
    </div>
  );
}
