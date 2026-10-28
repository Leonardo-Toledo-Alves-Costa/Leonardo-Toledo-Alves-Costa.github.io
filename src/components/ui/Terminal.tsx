import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Bloco de terminal: prompt em verde e conteúdo em mono. */
export function Terminal({ prompt = ">", className, children }: { prompt?: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-signal/25 bg-surface-1 p-4 font-mono text-sm leading-relaxed text-text", className)}>
      <span aria-hidden className="mr-2 select-none text-signal">
        {prompt}
      </span>
      {children}
    </div>
  );
}
