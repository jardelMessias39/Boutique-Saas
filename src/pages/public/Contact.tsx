import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useStore } from "@/context/StoreContext";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";

export function ContactPage() {
  const store = useStore();

  const items = [
    store.whatsapp && { label: "WhatsApp", value: store.whatsapp },
    store.instagram && { label: "Instagram", value: `@${store.instagram}` },
    store.facebook && { label: "Facebook", value: store.facebook },
    store.address && { label: "Endereço", value: store.address },
    store.city && { label: "Cidade", value: store.city },
    store.businessHours && { label: "Horário", value: store.businessHours },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Container className="py-16 max-w-lg">
      <PageHeader eyebrow="Fale conosco" title="Contato" />

      {items.length === 0 ? (
        <p className="text-center text-sm text-ink-soft">
          As informações de contato ainda não foram configuradas pela loja.
        </p>
      ) : (
        <dl className="space-y-4 mb-10">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between border-b border-line pb-3">
              <dt className="label-caps text-ink-soft">{item.label}</dt>
              <dd className="text-sm text-ink text-right">{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {store.whatsapp && (
        <div className="text-center">
          <a href={buildWhatsAppLink(store.whatsapp, generalContactMessage())} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg" icon={<WhatsAppIcon />}>
              Enviar mensagem no WhatsApp
            </Button>
          </a>
        </div>
      )}
    </Container>
  );
}
