import { Link } from "react-router-dom";
import { useAsync } from "@/hooks/useAsync";
import { listLookProducts } from "@/services/looks";
import { listProductImages } from "@/services/products";
import { getFileUrl } from "@/lib/storage";
import type { Look } from "@/types/domain";

export function LookCard({ look }: { look: Look }) {
  const fallbackState = useAsync(async () => {
    if (look.coverImageUrl) return null; // já tem capa, não precisa buscar nada
    const products = await listLookProducts(look.$id);
    if (products.length === 0) return null;
    const images = await listProductImages(products[0].$id);
    return images[0]?.url ?? null;
  }, [look.$id, look.coverImageUrl]);

  const imageId = look.coverImageUrl ?? (fallbackState.status === "success" ? fallbackState.data : null);

  return (
    <Link
      to={`/look/${look.$id}`}
      className="group block rounded-xl overflow-hidden border border-line bg-white/60 hover:shadow-[var(--shadow-soft)] transition-shadow"
    >
      <div className="aspect-[4/5] bg-blush-50 overflow-hidden">
        {imageId ? (
          <img
            src={getFileUrl(imageId)}
            alt={look.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-ink-soft/60">
            Sem foto ainda
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium">{look.name}</h3>
        <span className="text-xs text-rose-700">Ver look</span>
      </div>
    </Link>
  );
}
