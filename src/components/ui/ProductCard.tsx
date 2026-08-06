import { Link } from "react-router-dom";
import { formatPrice, STATUS_LABELS, STATUS_STYLES } from "@/lib/format";
import { useAsync } from "@/hooks/useAsync";
import { listProductImages } from "@/services/products";
import { getFileUrl } from "@/lib/storage";
import type { Product } from "@/types/domain";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imagesState = useAsync(() => listProductImages(product.$id), [product.$id]);
  const firstImage = imagesState.status === "success" ? imagesState.data[0] : null;

  return (
    <Link
      to={`/produto/${product.$id}`}
      className="group block rounded-xl overflow-hidden border border-line bg-white/60 transition-all duration-300 hover:border-rose-300 hover:shadow-[var(--shadow-lifted)] hover:-translate-y-0.5"
    >
      <div className="relative aspect-[3/4] bg-blush-50 overflow-hidden">
        {firstImage ? (
          <img
            src={getFileUrl(firstImage.url)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-ink-soft/60 text-center p-4">
            {imagesState.status === "loading" ? "" : "Sem foto ainda"}
          </div>
        )}

        {/* Brilho sutil que desliza sobre a foto ao passar o mouse */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/0 group-hover:via-white/10 group-hover:to-white/0 transition-all duration-500" />

        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="label-caps bg-cream/95 text-rose-700 px-2 py-1 rounded-md border border-line">
            Peça única
          </span>
          <span
            className={`label-caps px-2 py-1 rounded-md ${STATUS_STYLES[product.status]}`}
          >
            {STATUS_LABELS[product.status]}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium text-ink truncate">{product.name}</h3>
        <p className="text-rose-700 font-semibold mt-0.5">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
