import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LookCard } from "@/components/ui/LookCard";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { listLooks } from "@/services/looks";

export function LooksPage() {
  const store = useStore();
  const state = useAsync(() => listLooks(store.$id), [store.$id]);

  return (
    <Container className="py-16">
      <PageHeader
        eyebrow="Combinações prontas"
        title="Looks Montados pela Loja"
        description="Combinações já pensadas pela nossa equipe — escolha a que mais combina e reserve com um clique."
      />

      {state.status === "loading" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-xl bg-blush-50/60 animate-pulse" />
          ))}
        </div>
      )}

      {state.status === "success" && state.data.length === 0 && (
        <EmptyState>
          Nenhum look montado ainda. Assim que a loja criar o primeiro em{" "}
          <strong>Minha Loja → Looks</strong>, ele aparece aqui.
        </EmptyState>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {state.data.map((look) => (
            <LookCard key={look.$id} look={look} />
          ))}
        </div>
      )}
    </Container>
  );
}
