import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { RibbonDivider } from "@/components/ui/RibbonDivider";
import { useStore } from "@/context/StoreContext";

export function AboutPage() {
  const store = useStore();

  return (
    <Container className="py-16 max-w-2xl">
      <PageHeader eyebrow="Nossa história" title={`Sobre a ${store.name}`} />

      <div className="prose-sm text-ink-soft text-[15px] leading-relaxed space-y-4">
        <p>
          A {store.name} nasceu do carinho por vestir crianças com peças
          únicas, escolhidas com cuidado para acompanhar cada fase da
          infância — do primeiro passeio às datas mais especiais.
        </p>
        <p>
          Cada peça é selecionada pessoalmente, pensando em qualidade,
          conforto e também naquele toque de encantamento que só uma roupa
          bem escolhida traz.
        </p>
        {store.city && (
          <p>
            Estamos localizadas em {store.city}, e todo atendimento é feito
            de forma próxima e pessoal — sem pressa, sem robôs, só cuidado de
            verdade.
          </p>
        )}
      </div>

      <RibbonDivider className="my-12" />

      <p className="text-center font-script text-2xl text-rose-700">
        Roupas que contam histórias e criam lembranças
      </p>
    </Container>
  );
}
