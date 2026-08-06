import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-3xl mb-3">Página não encontrada</h1>
      <p className="text-ink-soft mb-8">A página que você procura não existe ou foi removida.</p>
      <Link to="/">
        <Button>Voltar para a home</Button>
      </Link>
    </Container>
  );
}
