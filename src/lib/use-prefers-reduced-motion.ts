"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * `true`/`false` conforme a preferência do sistema; `null` no HTML estático e durante a hidratação.
 * Via useSyncExternalStore: a hidratação usa o valor do servidor e só depois atualiza — sem divergência
 * de atributos (o React 19 não corrige atributos divergentes na hidratação).
 */
export function usePrefersReducedMotion(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => null,
  );
}
