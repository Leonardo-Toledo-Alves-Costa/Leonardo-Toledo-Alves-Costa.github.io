import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Largura máxima de 1200px, com respiro lateral de 16px no celular e 24px a partir de tablet. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6", className)}>{children}</div>;
}
