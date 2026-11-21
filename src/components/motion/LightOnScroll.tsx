"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Acende os itens `[data-lit]` de dentro quando o topo deles passa de 60% da altura da tela
 * (e apaga ao voltar). O servidor entrega tudo com `data-lit="true"`: sem JS ou com
 * "reduzir movimento", tudo fica aceso. Só troca o atributo — o visual é CSS (opacidade/escala).
 */
export function LightOnScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduce !== false) return;
    const items = [...root.querySelectorAll<HTMLElement>("[data-lit]")];
    // Raiz = 60% de cima da tela: o item "entra" quando o topo cruza a linha dos 60%.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const line = e.rootBounds?.bottom ?? window.innerHeight * 0.6;
          (e.target as HTMLElement).dataset.lit = String(e.boundingClientRect.top < line);
        }
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 0 },
    );
    for (const item of items) io.observe(item);
    return () => {
      io.disconnect();
      for (const item of items) item.dataset.lit = "true";
    };
  }, [reduce]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
