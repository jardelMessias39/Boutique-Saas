import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ProductCard } from "@/components/ui/ProductCard";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { ReviewForm } from "@/components/ui/ReviewForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { useAsync } from "@/hooks/useAsync";
import { getProduct, listProductImages, listRelatedProducts } from "@/services/products";
import { listApprovedReviews } from "@/services/reviews";
import { getFileUrl } from "@/lib/storage";
import { buildWhatsAppLink, reserveProductMessage } from "@/lib/whatsapp";
import { formatPrice, STATUS_LABELS, STATUS_STYLES } from "@/lib/format";

export function ProductPage() {
  const { id = "" } = useParams();
  const store = useStore();
  const { addItem, isInCart } = useCart();

  const state = useAsync(async () => {
    const product = await getProduct(id);
    if (!product) return null;
    const images = await listProductImages(id);
    return { product, images };
  }, [id]);

  if (state.status === "loading") {
    return (
      <Container className="py-16">
        <p className="text-center text-sm text-ink-soft">Carregando peça…</p>
      </Container>
    );
  }

  if (state.status === "error" || (state.status === "success" && state.data === null)) {
    return (
      <Container className="py-16">
        <EmptyState>Essa peça não foi encontrada. Ela pode ter sido vendida ou removida.</EmptyState>
      </Container>
    );
  }

  if (state.status !== "success" || !state.data) return null;
  const { product, images } = state.data;

  return (
    <Container className="py-12 md:py-16">
      <div className="grid lg:grid-cols-2 gap-10">
        <Gallery images={images} productName={product.name} />

        <div>
          <span className={`label-caps inline-block px-2.5 py-1 rounded-md mb-4 ${STATUS_STYLES[product.status]}`}>
            {STATUS_LABELS[product.status]}
          </span>

          <h1 className="text-3xl md:text-4xl mb-2">{product.name}</h1>
          <p className="text-2xl text-rose-700 font-semibold mb-6">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="text-ink-soft text-[15px] leading-relaxed mb-6">{product.description}</p>
          )}

          <dl className="grid grid-cols-2 gap-3 text-sm mb-8">
            {product.size && <Spec label="Tamanho" value={product.size} />}
            {product.color && <Spec label="Cor" value={product.color} />}
            {product.brand && <Spec label="Marca" value={product.brand} />}
            <Spec label="Estado" value={capitalize(product.condition)} />
          </dl>

          <div className="flex flex-wrap gap-3">
            {store.whatsapp && (
              <a
                href={buildWhatsAppLink(store.whatsapp, reserveProductMessage(product.name, product.price))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="whatsapp" icon={<WhatsAppIcon />}>
                  Reservar pelo WhatsApp
                </Button>
              </a>
            )}

            <Button
              size="lg"
              variant="outline"
              disabled={isInCart(product.$id)}
              onClick={() =>
                addItem({ productId: product.$id, name: product.name, price: product.price, size: product.size })
              }
            >
              {isInCart(product.$id) ? "Já está no carrinho ✓" : "Adicionar ao carrinho"}
            </Button>
          </div>
          <p className="text-xs text-ink-soft mt-2">
            Quer reservar várias peças juntas? Adicione ao carrinho e envie tudo numa mensagem só.
          </p>
        </div>
      </div>

      <RelatedProducts storeId={store.$id} categoryId={product.categoryId} excludeId={product.$id} />
      <ReviewsSection storeId={store.$id} ownerId={store.ownerId} />
    </Container>
  );
}

function Gallery({ images, productName }: { images: { $id: string; url: string }[]; productName: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-blush-50 border border-line flex items-center justify-center text-sm text-ink-soft">
        Sem foto ainda
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square rounded-2xl overflow-hidden border border-line bg-blush-50 mb-3">
        <img
          src={getFileUrl(images[active].url)}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.$id}
              onClick={() => setActive(i)}
              className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                i === active ? "border-rose-500" : "border-transparent"
              }`}
            >
              <img src={getFileUrl(img.url)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-caps text-ink-soft/70">{label}</dt>
      <dd className="text-ink mt-0.5">{value}</dd>
    </div>
  );
}

function RelatedProducts({
  storeId,
  categoryId,
  excludeId,
}: {
  storeId: string;
  categoryId: string;
  excludeId: string;
}) {
  const state = useAsync(
    () => listRelatedProducts(storeId, categoryId, excludeId),
    [storeId, categoryId, excludeId]
  );

  if (state.status !== "success" || state.data.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl mb-6">Você também pode gostar</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {state.data.map((p) => (
          <ProductCard key={p.$id} product={p} />
        ))}
      </div>
    </section>
  );
}

function ReviewsSection({ storeId, ownerId }: { storeId: string; ownerId: string }) {
  const state = useAsync(() => listApprovedReviews(storeId), [storeId]);

  return (
    <section className="mt-20 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-6 text-center">Avaliações de clientes</h2>

      {state.status === "success" && state.data.length > 0 && (
        <div className="space-y-4 mb-8">
          {state.data.map((r) => (
            <ReviewCard key={r.$id} review={r} />
          ))}
        </div>
      )}

      {state.status === "success" && state.data.length === 0 && (
        <p className="text-center text-sm text-ink-soft mb-8">
          Ainda não há avaliações. Seja a primeira a avaliar!
        </p>
      )}

      <ReviewForm storeId={storeId} ownerId={ownerId} />
    </section>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
