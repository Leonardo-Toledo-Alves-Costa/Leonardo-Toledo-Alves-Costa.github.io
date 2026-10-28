"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { usePointerVars } from "@/lib/use-pointer-vars";

/**
 * Card cuja borda acende em verde sob o ponteiro, com uma luz suave por dentro.
 * Em repouso (e no celular, que não tem hover) a luz fica acesa fraca no canto superior.
 * Ref. 21st Spotlight Card (#2220), adaptado: variáveis CSS em vez de estado React (sem re-render a cada movimento).
 */
export function SpotlightCard({ className, children }: { className?: string; children: ReactNode }) {
  const ref = usePointerVars<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-spotlight=""
      className={cn(
        "group relative overflow-hidden rounded-card border border-line bg-surface-1 p-6",
        // Borda que acende: anel de 1px (padding) mascarado, dentro da caixa para não ser recortado.
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-card before:content-[''] before:ring-mask",
        "before:bg-[radial-gradient(220px_circle_at_var(--mx,25%)_var(--my,0%),rgb(124_255_107/0.7),transparent_60%)]",
        "before:opacity-45 before:transition-opacity before:duration-300 hover:before:opacity-100 focus-within:before:opacity-100",
        // Luz interna.
        "after:pointer-events-none after:absolute after:inset-0 after:content-['']",
        "after:bg-[radial-gradient(320px_circle_at_var(--mx,25%)_var(--my,0%),rgb(255_255_255/0.06),transparent_50%)]",
        "after:opacity-45 after:transition-opacity after:duration-300 hover:after:opacity-100",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
