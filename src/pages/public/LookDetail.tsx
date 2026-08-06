import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { getLook, listLookProducts } from "@/services/looks";
import { buildWhatsAppLink, reserveLookMessage } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";

export function LookDetailPage() {
  const { id = "" } = useParams();
  const store = useStore();

  const state = useAsync(async () => {
    const look = await getLook(id);
    if (!look) return null;
    const products = await listLookProducts(id);
    return { look, products };
  }, [id]);

  if (state.status === "loading") {
    return (
      <Container className="py-16">
        <p className="text-center text-sm text-ink-soft">Carregando look…</p>
      </Container>
    );
  }

  if (state.status === "error" || (state.status === "success" && state.data === null)) {
    return (
      <Container className="py-16">
        <EmptyState>Esse look não foi encontrado.</EmptyState>
      </Container>
    );
  }

  if (state.status !== "success" || !state.data) return null;
  const { look, products } = state.data;
  const total = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <Container className="py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="label-caps text-gold-700 mb-3">Look montado</p>
        <h1 className="text-3xl md:text-4xl mb-2">{look.name}</h1>
        {look.description && <p className="text-ink-soft text-[15px]">{look.description}</p>}
      </div>

      {products.length === 0 ? (
        <EmptyState>Esse look ainda não tem peças vinculadas.</EmptyState>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {products.map((p) => (
              <ProductCard key={p.$id} product={p} />
            ))}
          </div>

          <div className="max-w-sm mx-auto rounded-xl border border-line bg-white/60 p-6 text-center">
            <p className="label-caps text-ink-soft mb-2">Valor total do look</p>
            <p className="text-2xl text-rose-700 font-semibold mb-5">{formatPrice(total)}</p>
            {store.whatsapp && (
              <a
                href={buildWhatsAppLink(store.whatsapp, reserveLookMessage(look.name))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" icon={<WhatsAppIcon />} className="w-full">
                  Reservar pelo WhatsApp
                </Button>
              </a>
            )}
          </div>
        </>
      )}
    </Container>
  );
}
