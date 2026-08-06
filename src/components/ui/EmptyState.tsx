import type { ReactNode } from "react";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="text-center py-14 border border-dashed border-line rounded-xl">
      <p className="text-ink-soft text-sm max-w-sm mx-auto leading-relaxed">{children}</p>
    </div>
  );
}
