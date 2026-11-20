import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type OrbVariant = "hero" | "mini" | "halo";

/** Tamanho padrão de cada uso; para trocar, use a prop `size` (não a className). */
const SIZE: Record<OrbVariant, string> = {
  hero: "w-[min(36vh,62vw)]",
  mini: "w-20",
  halo: "w-[min(56vh,90vw)]",
};

/** O halo de abertura de /projetos é quase só luz: esfera mais apagada. */
const SPHERE_OPACITY: Record<OrbVariant, string> = { hero: "opacity-100", mini: "opacity-100", halo: "opacity-60" };

type OrbProps = {
  variant: OrbVariant;
  /** Classe de largura no lugar da padrão (cn não resolve conflitos, então o tamanho tem prop própria). */
  size?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Orbe Abissal: contêiner quadrado com halo, esfera e grão em CSS (spec §4.3).
 * É o que aparece sem JS, com "reduzir movimento" e em qualquer falha do WebGL.
 * O slot `data-orb-canvas-slot` recebe o shader (Task 8).
 */
export function Orb({ variant, size, className, style }: OrbProps) {
  return (
    <div
      data-orb=""
      data-variant={variant}
      data-renderer="css"
      aria-hidden="true"
      className={cn("pointer-events-none relative aspect-square", size ?? SIZE[variant], className)}
      style={style}
    >
      <div data-orb-halo="" className="orb-halo absolute -inset-[45%] rounded-full" />
      <div data-orb-sphere="" className={cn("orb-sphere absolute inset-0 rounded-full", SPHERE_OPACITY[variant])} />
      <div className="orb-grain absolute inset-0 rounded-full" />
      <div data-orb-canvas-slot="" className="absolute inset-0" />
    </div>
  );
}
