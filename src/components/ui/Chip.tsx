import type { ReactNode } from "react";
import type { SkillLevel } from "@/content/types";
import { cn } from "@/lib/cn";

const levelStyles: Record<SkillLevel, { chip: string; dot: string }> = {
  // Componente "desligado": ainda estudando.
  learning: { chip: "border-line text-ink-dim", dot: "bg-ink-dim" },
  // Componente em uso: já aplicado em projeto.
  used: { chip: "border-white/20 text-ink", dot: "bg-accent-hi" },
  // LED aceso: domina.
  proficient: {
    chip: "border-accent-hi/45 text-accent-hi shadow-[0_0_12px_rgb(156_196_255/0.2)]",
    dot: "bg-accent-hi shadow-[0_0_8px_var(--color-accent-hi)]",
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
    "transition-[border-color,box-shadow,color,background-color] duration-200 ease-abissal",
    style.chip,
    // Selecionado: preenchido e com anel — distinto de um "domino" em repouso (que só tem a borda verde).
    selected ? "border-accent-hi bg-accent-hi/12 text-ink ring-1 ring-accent-hi shadow-[0_0_16px_rgb(156_196_255/0.28)]" : "bg-bg-deep",
    selected && level === "proficient" && "text-accent-hi",
    // Botão: alvo de toque ≥ 44px — largura mínima e área invisível de 6px acima e abaixo — e anel de foco.
    onClick &&
      "relative min-w-11 cursor-pointer justify-center hover:border-accent-hi/60 after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-hi",
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
