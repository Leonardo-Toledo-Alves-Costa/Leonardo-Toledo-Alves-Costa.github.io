"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const MS_PER_CHAR = 30;

/**
 * Linhas de "boot" digitadas em mono. Sem JS ou com "reduzir movimento", aparecem completas.
 * Cada linha termina com o status ("ok") destacado em verde.
 */
export function BootSequence({ lines, status = "ok", className }: { lines: string[]; status?: string; className?: string }) {
  const reduce = usePrefersReducedMotion();
  const total = lines.reduce((n, l) => n + l.length, 0);
  // undefined = ainda não hidratou ou não começou (HTML estático: texto completo).
  const [typed, setTyped] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Só começa a digitar quando a preferência é conhecida e permite movimento.
    if (reduce !== false) return;
    const id = window.setInterval(() => {
      setTyped((n) => {
        const next = n === undefined ? 0 : n + 1;
        if (next >= total) window.clearInterval(id);
        return Math.min(next, total);
      });
    }, MS_PER_CHAR);
    return () => window.clearInterval(id);
  }, [reduce, total]);

  // Com "reduzir movimento", mostra tudo direto (derivado, sem estado).
  const shown = reduce === true ? total : typed;
  const state = shown === undefined ? "pending" : shown >= total ? "done" : "typing";
  const chars = shown ?? total;
  // Início de cada linha na contagem total de caracteres.
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((n, l) => n + l.length, 0));

  return (
    <div data-boot="" data-state={state} className={cn("space-y-1.5 font-mono text-xs leading-relaxed text-text-2 sm:text-sm", className)}>
      {/* Leitores de tela recebem o texto completo de uma vez; a animação é só visual. */}
      <p className="sr-only">{lines.map((l) => `${l} ${status}`).join(". ")}</p>
      <div aria-hidden>
        {lines.map((line, i) => {
          const visible = Math.max(0, Math.min(line.length, chars - (starts[i] ?? 0)));
          const complete = visible === line.length;
          return (
            <p key={i} data-boot-line="" className="min-h-5 pl-4 -indent-4">
              <span className="text-text-2/60">&gt; </span>
              {line.slice(0, visible)}
              {complete && <span className="text-signal"> {status}</span>}
              {!complete && visible > 0 && <span className="animate-pulse text-signal">▋</span>}
            </p>
          );
        })}
      </div>
    </div>
  );
}
