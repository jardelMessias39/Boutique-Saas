import { useState } from "react";
import { submitReview } from "@/services/reviews";
import { Button } from "@/components/ui/Button";

export function ReviewForm({ storeId, ownerId }: { storeId: string; ownerId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setState("sending");
    try {
      await submitReview(storeId, ownerId, name.trim(), rating, comment.trim());
      setState("sent");
      setName("");
      setComment("");
      setRating(5);
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-xl border border-line bg-blush-50 p-6 text-center">
        <p className="text-rose-700 font-medium">Obrigada pela sua avaliação! 💕</p>
        <p className="text-sm text-ink-soft mt-1">
          Ela vai aparecer no site assim que for aprovada pela loja.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-white/60 p-6 space-y-4">
      <div>
        <label className="text-sm font-medium text-ink block mb-1.5" htmlFor="review-name">
          Seu nome
        </label>
        <input
          id="review-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-line px-3 py-2 text-sm bg-cream focus:outline-none focus:border-rose-400"
          placeholder="Como podemos te chamar?"
        />
      </div>

      <div>
        <span className="text-sm font-medium text-ink block mb-1.5">Sua nota</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <svg
                viewBox="0 0 20 20"
                className={`w-6 h-6 ${n <= rating ? "text-gold-500" : "text-line"}`}
                fill="currentColor"
              >
                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1L4.6 17.8l1.3-6L1.3 7.7l6.1-.6L10 1.5Z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink block mb-1.5" htmlFor="review-comment">
          Comentário (opcional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-line px-3 py-2 text-sm bg-cream focus:outline-none focus:border-rose-400 resize-none"
          placeholder="Conte como foi sua experiência..."
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-danger">Não foi possível enviar agora. Tente novamente.</p>
      )}

      <Button type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Enviando…" : "Enviar avaliação"}
      </Button>
    </form>
  );
}
