import type { Review } from "@/types/domain";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-line bg-white/60 p-5">
      <StarRow rating={review.rating} />
      {review.comment && <p className="text-sm text-ink-soft mt-3 leading-relaxed">{review.comment}</p>}
      <p className="text-sm font-medium text-rose-700 mt-3">{review.customerName}</p>
    </div>
  );
}

export function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i < rating ? "text-gold-500" : "text-line"}`}
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1L4.6 17.8l1.3-6L1.3 7.7l6.1-.6L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}
