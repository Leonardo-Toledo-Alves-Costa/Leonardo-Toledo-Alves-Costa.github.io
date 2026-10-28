import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Texto com reflexo cromado em movimento lento. O texto é real (selecionável, lido por leitores de tela). */
export function ChromeText({
  as: Tag = "h1",
  id,
  className,
  children,
}: {
  as?: "h1" | "h2" | "p";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag id={id} data-chrome="" className={cn("chrome-text", className)}>
      {children}
    </Tag>
  );
}
