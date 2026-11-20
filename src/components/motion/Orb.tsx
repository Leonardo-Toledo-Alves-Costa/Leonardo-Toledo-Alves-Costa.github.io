import type { MotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { OrbShaderLoader } from "./OrbShaderLoader";

export type OrbVariant = "hero" | "mini" | "halo";

/** Tamanho padrão de cada uso; para trocar, use a prop `size` (não a className). */
const SIZE: Record<OrbVariant, string> = {
  hero: "w-[min(36vh,62vw)]",
  mini: "w-20",
  halo: "w-[min(56vh,90vw)]",
};

/** O mini é pequeno demais para valer um contexto WebGL: fica sempre em CSS. */
const HAS_SHADER: Record<OrbVariant, boolean> = { hero: true, mini: false, halo: true };

/** O halo de abertura de /projetos é quase só luz: esfera mais apagada. */
const SPHERE_OPACITY: Record<OrbVariant, string> = { hero: "opacity-100", mini: "opacity-100", halo: "opacity-60" };

type OrbProps = {
  variant: OrbVariant;
  /** Classe de largura no lugar da padrão (cn não resolve conflitos, então o tamanho tem prop própria). */
  size?: string;
  className?: string;
  style?: CSSProperties;
  /** Progresso da expansão (0–1), repassado ao shader (uExpand). */
  expand?: MotionValue<number>;
};

/**
 * Orbe Abissal: contêiner quadrado com halo, esfera e grão em CSS (spec §4.3).
 * É o que aparece sem JS, com "reduzir movimento" e em qualquer falha do WebGL.
 * O slot `data-orb-canvas-slot` recebe o shader (OrbShaderLoader), exceto no mini.
 */
export function Orb({ variant, size, className, style, expand }: OrbProps) {
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
      <div data-orb-canvas-slot="" className={cn("absolute inset-0", SPHERE_OPACITY[variant])}>
        {HAS_SHADER[variant] && <OrbShaderLoader expand={expand} />}
      </div>
    </div>
  );
}
