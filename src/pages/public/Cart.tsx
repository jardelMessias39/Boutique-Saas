import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { listProductImages } from "@/services/products";
import { getFileUrl } from "@/lib/storage";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppLink, reserveCartMessage } from "@/lib/whatsapp";

export function CartPage() {
  const { items, removeItem, clear, total } = useCart();
  const store = useStore();

  return (
    <Container className="py-16 max-w-2xl">
      <PageHeader eyebrow="Suas escolhas" title="Carrinho" />

      {items.length === 0 ? (
        <EmptyState>
          Seu carrinho está vazio.{" "}
          <Link to="/novidades" className="text-rose-700 underline">
            Ver novidades
          </Link>
          .
        </EmptyState>
      ) : (
        <>
          <div className="space-y-3 mb-8">
            {items.map((item) => (
              <CartRow key={item.productId} item={item} onRemove={() => removeItem(item.productId)} />
            ))}
          </div>

          <div className="rounded-xl border border-line bg-white/60 p-6">
            <div className="flex items-center justify-between mb-5">
              <span className="label-caps text-ink-soft">Total ({items.length} peça{items.length > 1 ? "s" : ""})</span>
              <span className="text-2xl text-rose-700 font-semibold">{formatPrice(total)}</span>
            </div>

            {store.whatsapp && (
              <a
                href={buildWhatsAppLink(store.whatsapp, reserveCartMessage(items))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(clear, 500)}
              >
                <Button variant="whatsapp" size="lg" icon={<WhatsAppIcon />} className="w-full">
                  Reservar tudo pelo WhatsApp
                </Button>
              </a>
            )}

            <button onClick={clear} className="w-full text-center text-sm text-ink-soft mt-4 hover:text-danger">
              Esvaziar carrinho
            </button>
          </div>
        </>
      )}
    </Container>
  );
}

function CartRow({ item, onRemove }: { item: { productId: string; name: string; price: number; size?: string }; onRemove: () => void }) {
  const imagesState = useAsync(() => listProductImages(item.productId), [item.productId]);
  const firstImage = imagesState.status === "success" ? imagesState.data[0] : null;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-white/60 p-3">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-blush-50 shrink-0">
        {firstImage && (
          <img src={getFileUrl(firstImage.url)} alt={item.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        {item.size && <p className="text-xs text-ink-soft">{item.size}</p>}
      </div>
      <span className="text-sm font-semibold text-rose-700 shrink-0">{formatPrice(item.price)}</span>
      <button
        onClick={onRemove}
        aria-label={`Remover ${item.name} do carrinho`}
        className="text-ink-soft hover:text-danger shrink-0 p-1"
      >
        ×
      </button>
    </div>
  );
}
