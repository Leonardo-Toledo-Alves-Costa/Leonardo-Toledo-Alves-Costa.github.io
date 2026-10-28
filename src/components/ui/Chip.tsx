import type { ReactNode } from "react";
import type { SkillLevel } from "@/content/types";
import { cn } from "@/lib/cn";

const levelStyles: Record<SkillLevel, { chip: string; dot: string }> = {
  // Componente "desligado": ainda estudando.
  learning: { chip: "border-line text-text-2", dot: "bg-led-off" },
  // Componente em uso: já aplicado em projeto.
  used: { chip: "border-white/20 text-text", dot: "bg-led-dim" },
  // LED aceso: domina.
  proficient: {
    chip: "border-signal/45 text-signal shadow-[0_0_12px_rgb(124_255_107/0.2)]",
    dot: "bg-signal shadow-[0_0_8px_var(--color-signal)]",
  },
};

type ChipProps = {
  level: SkillLevel;
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

/** Tecnologia com nível. Com `onClick` vira botão (aria-pressed). */
export function Chip({ level, children, selected = false, onClick, className }: ChipProps) {
  const style = levelStyles[level];
  const classes = cn(
    "inline-flex min-h-8 items-center gap-2 rounded-md border px-2.5 font-mono text-xs",
    "transition-[border-color,box-shadow,color,background-color] duration-200 ease-out-ui",
    style.chip,
    // Selecionado: preenchido e com anel — distinto de um "domino" em repouso (que só tem a borda verde).
    selected ? "border-signal bg-signal/12 text-text ring-1 ring-signal shadow-[0_0_16px_rgb(124_255_107/0.28)]" : "bg-surface-1",
    selected && level === "proficient" && "text-signal",
    // Botão: alvo de toque ≥ 44px — largura mínima e área invisível de 6px acima e abaixo — e anel de foco.
    onClick &&
      "relative min-w-11 cursor-pointer justify-center hover:border-signal/60 after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal",
    className,
  );
  const content = (
    <>
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", style.dot)} />
      {children}
    </>
  );
  if (onClick) {
    return (
      <button type="button" data-level={level} aria-pressed={selected} onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }
  return (
    <span data-level={level} className={classes}>
      {content}
    </span>
  );
}
