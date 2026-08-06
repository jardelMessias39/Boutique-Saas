/**
 * Assinatura visual do projeto: um laço de fita desenhado em traço fino,
 * ecoando os laços das peças fotografadas, usado como divisor entre
 * seções no lugar de uma linha genérica. Aparece pequeno e discreto —
 * o objetivo é reconhecimento sutil, não decoração chamativa.
 */
export function RibbonDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="divider-gold w-16 md:w-24" />
      <svg viewBox="0 0 32 20" className="w-6 h-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M16 10c-3-5-9-6-12-3s1 8 6 5c2-1 3-2 3-2M16 10c3-5 9-6 12-3s-1 8-6 5c-2-1-3-2-3-2" strokeLinecap="round" />
        <circle cx="16" cy="10" r="1.6" fill="currentColor" stroke="none" />
      </svg>
      <span className="divider-gold w-16 md:w-24" />
    </div>
  );
}
