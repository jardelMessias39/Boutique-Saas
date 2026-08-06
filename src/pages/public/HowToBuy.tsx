import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useStore } from "@/context/StoreContext";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";

const STEPS = [
  { n: 1, title: "Escolha suas peças", description: "Navegue pelo site e encontre as peças que mais combinam com sua princesa." },
  { n: 2, title: "Reserve pelo WhatsApp", description: "Clique em \"Reservar\" e envie a mensagem já pronta — sem complicação." },
  { n: 3, title: "Experimente na loja", description: "Combine um horário e experimente a peça pessoalmente antes de levar." },
  { n: 4, title: "Pague na retirada", description: "O pagamento é feito presencialmente, com toda segurança, na hora da retirada." },
];

export function HowToBuyPage() {
  const store = useStore();

  return (
    <Container className="py-16 max-w-3xl">
      <PageHeader
        eyebrow="Sem complicação"
        title="Como Comprar"
        description="Aqui não tem checkout online — a reserva é simples, direta e pessoal, do jeitinho de uma boutique de verdade."
      />

      <ol className="space-y-8">
        {STEPS.map((step) => (
          <li key={step.n} className="flex gap-5">
            <span className="shrink-0 w-10 h-10 rounded-full bg-rose-600 text-cream flex items-center justify-center font-semibold">
              {step.n}
            </span>
            <div>
              <h3 className="font-medium text-ink">{step.title}</h3>
              <p className="text-sm text-ink-soft mt-1">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {store.whatsapp && (
        <div className="text-center mt-14">
          <a href={buildWhatsAppLink(store.whatsapp, generalContactMessage())} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg" icon={<WhatsAppIcon />}>
              Falar no WhatsApp agora
            </Button>
          </a>
        </div>
      )}
    </Container>
  );
}
