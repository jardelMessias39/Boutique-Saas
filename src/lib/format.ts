export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const STATUS_LABELS: Record<string, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

export const STATUS_STYLES: Record<string, string> = {
  disponivel: "bg-success/10 text-success",
  reservado: "bg-gold-500/15 text-gold-700",
  vendido: "bg-ink-soft/15 text-ink-soft",
};
