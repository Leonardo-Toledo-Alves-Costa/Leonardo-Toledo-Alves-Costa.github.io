"use client";

import { useEffect, useRef } from "react";

/**
 * Escreve a posição do ponteiro (em px, relativa ao elemento) nas variáveis CSS `--mx` e `--my`.
 * Usa variáveis CSS em vez de estado React: o efeito de luz acompanha o mouse sem re-renderizar.
 */
export function usePointerVars<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    // Com "reduzir movimento", a luz fica parada na posição padrão.
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
