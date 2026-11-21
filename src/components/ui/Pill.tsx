import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { SkillLevel } from "@/content/types";
import { cn } from "@/lib/cn";

/** Ponto de luz do nível: contorno = estudando, meio aceso = usei, cheio com brilho = domino. Também usado nas legendas. */
export const LEVEL_DOT: Record<SkillLevel, string> = {
  learning: "border border-ink-dim bg-transparent",
  used: "border border-accent-hi bg-[linear-gradient(90deg,var(--color-accent-hi)_50%,transparent_50%)]",
  proficient: "bg-accent-hi shadow-[0_0_10px_var(--color-accent)]",
};

const base = "inline-flex min-h-11 items-center gap-2.5 rounded-pill border px-4 text-sm text-ink backdrop-blur-[14px]";
/** Cores de repouso e de pressionado ficam separadas: cn só junta classes, não resolve conflito. */
const idle = "border-line bg-glass";
const active = "border-accent-hi bg-bg-glow shadow-[0_0_24px_rgb(47_123_255/0.35)]";

type PillProps = {
  level?: SkillLevel;
  /** Nome do nível no idioma da página ("estudando"); vai para leitores de tela junto da luz. */
  levelLabel?: string;
  children: ReactNode;
  className?: string;
} & (
  | ({ as?: "span" } & Record<`data-${string}`, string | undefined>)
  | ({ as: "button"; pressed?: boolean; /** Aparência acesa sem aria-pressed (ex.: painel aberto, que usa aria-expanded). */ lit?: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
);

/** Pílula de vidro (tecnologia, tag). Interativa só quando `as="button"`. */
export function Pill(props: PillProps) {
  const { level, levelLabel, children, className } = props;
  const body = (
    <>
      {level && <span data-dot="" aria-hidden className={cn("size-2 shrink-0 rounded-full", LEVEL_DOT[level])} />}
      <span>{children}</span>
      {level && levelLabel && <span className="sr-only">, {levelLabel}</span>}
    </>
  );
  if (props.as === "button") {
    const { as: _as, level: _l, levelLabel: _ll, children: _c, className: _cn, pressed, lit, type = "button", ...rest } = props;
    return (
      <button
        data-level={level}
        type={type}
        aria-pressed={pressed}
        className={cn(
          base,
          "min-w-11 cursor-pointer transition-[border-color,background-color,box-shadow] duration-200 ease-abissal",
          pressed || lit ? active : cn(idle, "hover:border-ink-dim"),
          className,
        )}
        {...rest}
      >
        {body}
      </button>
    );
  }
  const { as: _as, level: _l, levelLabel: _ll, children: _c, className: _cn, ...data } = props;
  return (
    <span data-level={level} className={cn(base, idle, className)} {...data}>
      {body}
    </span>
  );
}
