import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StarRow } from "@/components/ui/ReviewCard";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { listAllReviews, approveReview, rejectReview } from "@/services/reviews";
import type { Review, ReviewStatus } from "@/types/domain";

const TABS: { key: ReviewStatus | "todas"; label: string }[] = [
  { key: "pendente", label: "Pendentes" },
  { key: "aprovada", label: "Aprovadas" },
  { key: "rejeitada", label: "Rejeitadas" },
  { key: "todas", label: "Todas" },
];

export function ReviewsPage() {
  const store = useStore();
  const { user } = useAuth();
  const state = useAsync(() => listAllReviews(store.$id), [store.$id]);
  const [tab, setTab] = useState<ReviewStatus | "todas">("pendente");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleApprove(review: Review) {
    if (!user) return;
    setBusyId(review.$id);
    await approveReview(review.$id, user.$id);
    window.location.reload();
  }

  async function handleReject(review: Review) {
    setBusyId(review.$id);
    await rejectReview(review.$id);
    window.location.reload();
  }

  const filtered =
    state.status === "success"
      ? tab === "todas"
        ? state.data
        : state.data.filter((r) => r.status === tab)
      : [];

  return (
    <div>
      <h1 className="text-2xl mb-6">Avaliações</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              tab === t.key ? "bg-rose-600 text-cream border-rose-600" : "border-line text-ink-soft hover:border-rose-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {state.status === "success" && filtered.length === 0 && (
        <EmptyState>Nenhuma avaliação nesse filtro.</EmptyState>
      )}

      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.$id} className="rounded-xl border border-line bg-white/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{review.customerName}</p>
                <StarRow rating={review.rating} />
                {review.comment && <p className="text-sm text-ink-soft mt-2">{review.comment}</p>}
              </div>

              {review.status === "pendente" && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleApprove(review)} disabled={busyId === review.$id}>
                    Aprovar
                  </Button>
                  <Button size="sm" variant="ghost" className="text-danger" onClick={() => handleReject(review)} disabled={busyId === review.$id}>
                    Rejeitar
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
