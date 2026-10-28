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

/** Rótulo de seção no estilo serigrafia de placa: "01 · SOBRE". */
export function SectionLabel({ index, children, as: Tag = "p", id, className }: SectionLabelProps) {
  return (
    <Tag id={id} className={cn("silkscreen text-signal", className)}>
      <span aria-hidden>{index} · </span>
      {children}
    </Tag>
  );
}
