"use client";

import { type MotionValue, useMotionValue, useScroll } from "motion/react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type ScrollStageProps = {
  /** Altura do palco no desktop (≥ 768px), em vh. */
  heightVh: number;
  /** Altura no celular; padrão = heightVh. */
  mobileHeightVh?: number;
  /** "always" = tela fixa no celular e no desktop; "desktop" = no celular vira bloco normal. */
  sticky?: "always" | "desktop";
  className?: string;
  /** Recebe o progresso do palco (0 = topo, 1 = fim). */
  children: (progress: MotionValue<number>) => ReactNode;
} & Record<`data-${string}`, string | undefined>;

/**
 * Palco de rolagem: uma área alta com uma tela fixa (sticky) dentro, e o progresso de 0 a 1.
 * No HTML estático (sem JS) e com "reduzir movimento" o progresso é 1 — o conteúdo final aparece —
 * e o palco encolhe para a altura do conteúdo (nada de rolagem vazia).
 */
export function ScrollStage({ heightVh, mobileHeightVh, sticky = "always", className, children, ...data }: ScrollStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useMotionValue(1);
  // Com sticky="desktop", abaixo de 768px o palco é um bloco normal: progresso 1, como sem JS.
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const animated = reduce === false && (sticky === "always" || desktop);

  useEffect(() => {
    if (!animated) {
      progress.set(1);
      return;
    }
    progress.set(scrollYProgress.get());
    return scrollYProgress.on("change", (v) => progress.set(v));
  }, [animated, progress, scrollYProgress]);

  const style = {
    "--stage-h": `${mobileHeightVh ?? heightVh}svh`,
    "--stage-h-md": `${heightVh}svh`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      {...data}
      style={animated ? style : undefined}
      className={cn("relative", animated && (sticky === "always" ? "h-(--stage-h) md:h-(--stage-h-md)" : "md:h-(--stage-h-md)"), className)}
    >
      <div
        className={cn(
          animated && (sticky === "always" ? "sticky top-0 h-svh" : "md:sticky md:top-0 md:h-svh"),
          "flex flex-col justify-center",
        )}
      >
        {children(progress)}
      </div>
    </div>
  );
}
