"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { usePointerVars } from "@/lib/use-pointer-vars";

type GlassPanelProps = {
  as?: "div" | "nav" | "section";
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

/** Painel de vidro com reflexo de luz que acompanha o ponteiro. */
export function GlassPanel({ as: Tag = "div", className, children, ...rest }: GlassPanelProps) {
  const ref = usePointerVars<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      data-glass=""
      className={cn(
        "glass relative overflow-hidden rounded-panel",
        "before:pointer-events-none before:absolute before:inset-0 before:content-['']",
        "before:bg-[radial-gradient(240px_circle_at_var(--mx,30%)_var(--my,0%),rgb(255_255_255/0.18),transparent_50%)]",
        className,
      )}
      {...rest}
    >
      <div className="relative">{children}</div>
    </Tag>
  );
}
