"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * `true`/`false` conforme a media query; `null` no HTML estático, na hidratação e quando `query` é null
 * (sem listener nenhum). Mesmo padrão de usePrefersReducedMotion (useSyncExternalStore). A inscrição é
 * memorizada por query: re-renderizar o componente não recria o listener.
 */
export function useMediaQuery(query: string | null): boolean | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!query) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => (query ? window.matchMedia(query).matches : null),
    () => null,
  );
}
