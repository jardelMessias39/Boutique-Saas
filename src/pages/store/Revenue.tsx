import { useStore } from "@/context/StoreContext";
import { useAsync } from "@/hooks/useAsync";
import { listSales, computeSalesStats } from "@/services/sales";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/format";

export function RevenuePage() {
  const store = useStore();
  const state = useAsync(() => listSales(store.$id), [store.$id]);

  if (state.status === "loading") {
    return <p className="text-sm text-ink-soft">Carregando…</p>;
  }

  if (state.status === "error") {
    return <p className="text-sm text-danger">Não foi possível carregar os dados de vendas agora.</p>;
  }

  const sales = state.data;
  const stats = computeSalesStats(sales);

  if (sales.length === 0) {
    return (
      <div>
        <h1 className="text-2xl mb-8">Faturamento</h1>
        <EmptyState>
          Nenhuma venda registrada ainda. Assim que você marcar uma peça como
          "vendido" em <strong>Produtos</strong>, ela aparece aqui.
        </EmptyState>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl mb-8">Faturamento</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <StatCard label="Faturamento total" value={formatPrice(stats.totalRevenue)} />
        <StatCard label="Peças vendidas (total)" value={String(stats.totalSales)} />
        <StatCard label="Faturamento do mês" value={formatPrice(stats.monthRevenue)} />
        <StatCard label="Vendas no mês" value={String(stats.monthSalesCount)} />
        <StatCard
          label="Projeção do mês"
          value={formatPrice(stats.monthProjection)}
          hint="Estimativa com base na média diária até hoje"
        />
        <StatCard
          label="Peça mais vendida"
          value={stats.bestSellingProduct ? stats.bestSellingProduct.name : "—"}
          hint={stats.bestSellingProduct ? `${stats.bestSellingProduct.count} venda(s)` : undefined}
        />
      </div>

      {stats.bestSellingCategory && (
        <p className="text-sm text-ink-soft mb-10">
          Categoria mais vendida: <strong className="text-ink">{stats.bestSellingCategory.name}</strong> (
          {stats.bestSellingCategory.count} venda{stats.bestSellingCategory.count > 1 ? "s" : ""})
        </p>
      )}

      <h2 className="text-lg font-medium mb-4">Histórico de vendas</h2>
      <div className="space-y-2">
        {sales.map((sale) => (
          <div
            key={sale.$id}
            className="flex items-center justify-between rounded-xl border border-line bg-white/60 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-ink truncate">{sale.productName}</p>
              <p className="text-sm text-ink-soft">
                {sale.categoryName || "Sem categoria"} ·{" "}
                {new Date(sale.soldAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <p className="text-rose-700 font-semibold shrink-0">{formatPrice(sale.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white/60 p-5">
      <p className="text-xl font-semibold text-rose-700 truncate">{value}</p>
      <p className="text-sm text-ink-soft mt-1">{label}</p>
      {hint && <p className="text-xs text-ink-soft/70 mt-0.5">{hint}</p>}
    </div>
  );
}
