import type { SkillCategory } from "@/content/types";
import { cn } from "@/lib/cn";

type Trace = { id: string; d: string };

// Trilhas em ângulo de 45°/90°, como numa placa de verdade. viewBox 1000×400.
const TRACES: Record<"hero" | "board", Trace[]> = {
  hero: [
    { id: "h1", d: "M0 330 H240 L290 280 H560 L610 230 H1000" },
    // Fora do canto superior esquerdo, onde fica o texto do boot.
    { id: "h2", d: "M560 0 V70 L610 120 H1000" },
    { id: "h3", d: "M420 0 V130 L470 180 V400" },
    { id: "h4", d: "M820 400 V300 L870 250 H1000" },
  ],
  // Cada categoria da stack tem uma trilha até o barramento central (onde fica o painel de detalhe).
  board: [
    { id: "software" satisfies SkillCategory, d: "M60 60 H300 L360 120 H440 L500 180" },
    { id: "cloud" satisfies SkillCategory, d: "M940 60 H700 L640 120 H560 L500 180" },
    { id: "engineering" satisfies SkillCategory, d: "M60 340 H300 L360 280 H440 L500 220" },
    { id: "hardware-ai" satisfies SkillCategory, d: "M940 340 H700 L640 280 H560 L500 220" },
  ],
};

/** Pad (via) no início da trilha, como numa placa real. */
function Pad({ d, active }: { d: string; active: boolean }) {
  // Toda trilha começa com "M<x> <y>".
  const [, x, y] = /^M(\d+) (\d+)/.exec(d) ?? [];
  if (!x || !y) return null;
  return <circle data-pad="" cx={x} cy={y} r={5} className={active ? "fill-signal" : "fill-signal/30"} />;
}

type CircuitTracesProps = {
  variant: "hero" | "board";
  /** Trilhas acesas (verde + brilho). No modo "board", são categorias da stack. */
  activeIds?: string[];
  className?: string;
};

/** Trilhas de circuito decorativas, com pulsos de energia correndo nas acesas (ou em todas, no hero). */
export function CircuitTraces({ variant, activeIds = [], className }: CircuitTracesProps) {
  const traces = TRACES[variant];
  // Hero preenche cortando as bordas; a placa mantém a proporção (sem trilhas distorcidas).
  const aspect = variant === "hero" ? "xMidYMid slice" : "xMidYMid meet";
  return (
    <svg
      aria-hidden="true"
      data-variant={variant}
      viewBox="0 0 1000 400"
      preserveAspectRatio={aspect}
      className={cn("pointer-events-none h-full w-full", className)}
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        {traces.map((trace, i) => {
          const active = activeIds.includes(trace.id);
          // No hero, todas pulsam (fundo vivo); na placa, só as acesas.
          const pulsing = variant === "hero" || active;
          return (
            <g key={trace.id}>
              <path
                data-trace-id={trace.id}
                data-active={active ? "true" : "false"}
                d={trace.d}
                strokeWidth={1.2}
                vectorEffect="non-scaling-stroke"
                className={cn(
                  "transition-[stroke,filter] duration-300 ease-out-ui",
                  active ? "stroke-signal drop-shadow-[0_0_6px_rgb(124_255_107/0.8)]" : "stroke-signal/25",
                )}
              />
              {pulsing && (
                <path
                  data-pulse=""
                  d={trace.d}
                  pathLength={100}
                  strokeWidth={2}
                  strokeDasharray="8 92"
                  vectorEffect="non-scaling-stroke"
                  className="stroke-signal drop-shadow-[0_0_4px_rgb(124_255_107/0.9)]"
                  style={{ animation: `trace-pulse ${3.2 + i * 0.6}s linear ${i * 0.7}s infinite` }}
                />
              )}
              {variant === "board" && <Pad d={trace.d} active={active} />}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
