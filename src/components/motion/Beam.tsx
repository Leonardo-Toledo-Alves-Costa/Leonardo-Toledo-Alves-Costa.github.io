"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Feixe de luz vertical (spec §5.4): linha de 1px em gradiente (transparente no alto → accent → accent-hi
 * na ponta), com um brilho largo desfocado atrás, terminando num nó aceso. A linha desce (scaleY a partir
 * do topo) enquanto o bloco entra na tela e o nó só acende quando a ponta chega nele.
 * Sem JS ou com "reduzir movimento": inteiro, parado e com o nó aceso.
 */
export function Beam({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const nodeOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const nodeScale = useTransform(scrollYProgress, [0.85, 1], [0.4, 1]);
  const active = reduce === false;

  return (
    <div ref={ref} className={cn("relative mx-auto w-px", className)}>
      <motion.div
        data-beam=""
        aria-hidden="true"
        style={active ? { scaleY } : undefined}
        className={cn(
          "pointer-events-none absolute inset-0 origin-top bg-linear-to-b from-transparent via-accent to-accent-hi",
          // Brilho: a mesma luz, larga e desfocada, atrás da linha.
          "before:absolute before:inset-y-0 before:-left-6 before:w-12 before:bg-linear-to-b before:from-transparent before:via-accent/25 before:to-accent/40 before:blur-xl",
        )}
      />
      <motion.span
        data-beam-node=""
        aria-hidden="true"
        style={active ? { opacity: nodeOpacity, scale: nodeScale } : undefined}
        className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-ink shadow-[0_0_12px_2px_var(--color-accent),0_0_40px_8px_color-mix(in_srgb,var(--color-accent)_35%,transparent)]"
      />
    </div>
  );
}
