import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { listProducts } from "@/services/products";
import { listAllReviews } from "@/services/reviews";
import { listLooks } from "@/services/looks";
import { listSales, computeSalesStats } from "@/services/sales";
import { formatPrice } from "@/lib/format";

export function DashboardPage() {
  const store = useStore();

  const products = useAsync(() => listProducts(store.$id, { limit: 200 }), [store.$id]);
  const reviews = useAsync(() => listAllReviews(store.$id), [store.$id]);
  const looks = useAsync(() => listLooks(store.$id), [store.$id]);
  const sales = useAsync(() => listSales(store.$id), [store.$id]);

  const pendingReviews = reviews.status === "success" ? reviews.data.filter((r) => r.status === "pendente").length : null;
  const stats = sales.status === "success" ? computeSalesStats(sales.data) : null;

  return (
    <div>
      <h1 className="text-2xl mb-1">Olá, {store.name} 👋</h1>
      <p className="text-sm text-ink-soft mb-8">Aqui está um resumo rápido da sua loja.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Peças cadastradas" value={products.status === "success" ? products.data.length : "…"} />
        <StatCard label="Looks montados" value={looks.status === "success" ? looks.data.length : "…"} />
        <StatCard
          label="Avaliações pendentes"
          value={pendingReviews ?? "…"}
          highlight={typeof pendingReviews === "number" && pendingReviews > 0}
        />
        <StatCard label="Faturamento do mês" value={stats ? formatPrice(stats.monthRevenue) : "…"} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <QuickLink to="/minha-loja/produtos/novo" title="Cadastrar peça nova" description="Leva menos de 1 minuto." />
        <QuickLink to="/minha-loja/faturamento" title="Ver faturamento completo" description="Histórico, mais vendido e projeção do mês." />
        <QuickLink to="/minha-loja/avaliacoes" title="Moderar avaliações" description="Aprove ou recuse comentários." />
        <QuickLink to="/minha-loja/configuracoes" title="Configurações da loja" description="WhatsApp, endereço, horário." />
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${highlight ? "border-gold-500 bg-gold-500/10" : "border-line bg-white/60"}`}>
      <p className="text-2xl font-semibold text-rose-700">{value}</p>
      <p className="text-sm text-ink-soft mt-1">{label}</p>
    </div>
  );
}

function QuickLink({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-line bg-white/60 p-5 hover:border-rose-400 hover:shadow-[var(--shadow-soft)] transition-all"
    >
      <p className="font-medium text-ink">{title}</p>
      <p className="text-sm text-ink-soft mt-1">{description}</p>
    </Link>
  );
}
