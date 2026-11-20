import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionLabelProps = {
  /** Posição real da seção na página ("01", "02"…). */
  index: string;
  children: ReactNode;
  as?: "p" | "h2";
  id?: string;
  className?: string;
};

/** Rótulo de seção em mono: "01 — Sobre" (spec §4.2). O número é decorativo para leitores de tela. */
export function SectionLabel({ index, children, as: Tag = "p", id, className }: SectionLabelProps) {
  return (
    <Tag id={id} data-section-label="" className={cn("font-mono text-xs tracking-[0.14em] text-ink-dim uppercase", className)}>
      <span aria-hidden>{index} — </span>
      {children}
    </Tag>
  );
}
