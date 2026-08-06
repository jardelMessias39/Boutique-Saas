import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { listLooks } from "@/services/looks";
import { getFileUrl } from "@/lib/storage";

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
            <div key={look.$id} className="rounded-xl border border-line bg-white/60 overflow-hidden">
              <div className="aspect-video bg-blush-50">
                {look.coverImageUrl && (
                  <img src={getFileUrl(look.coverImageUrl)} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <p className="font-medium">{look.name}</p>
                {look.description && <p className="text-sm text-ink-soft mt-1">{look.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
