import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type GlassCardProps = {
  as?: "div" | "article" | "li" | "section";
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/** Cartão de vidro Abissal: azul translúcido + desfoque + borda fina. Só para blocos curtos (spec §4.1). */
export function GlassCard({ as: Tag = "div", className, children, ...rest }: GlassCardProps) {
  // cn não resolve conflitos: o padding padrão só entra se quem usa não passou o seu.
  const hasPadding = /(^|\s)p-\d/.test(className ?? "");
  return (
    <Tag data-glass-card="" className={cn("glass rounded-card", !hasPadding && "p-5 sm:p-6", className)} {...rest}>
      {children}
    </Tag>
  );
}
