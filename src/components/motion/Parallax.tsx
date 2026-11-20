"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/** Deslocamento máximo (px) para speed = 1, de quando o elemento entra até quando sai da tela. */
const RANGE = 400;

type ParallaxProps = {
  /** Velocidade relativa: positivo sobe mais rápido que a rolagem; negativo fica para trás. */
  speed: number;
  /** false = parado abaixo de 768px (no celular, no máximo 2 camadas — spec §4.4). */
  mobile?: boolean;
  className?: string;
  children?: ReactNode;
} & Record<`data-${string}`, string | undefined>;

/**
 * Camada de parallax: só `transform` (translateY) ligado à rolagem do próprio elemento.
 * Sem JS ou com "reduzir movimento", fica parada no lugar (sem transform).
 */
export function Parallax({ speed, mobile = true, className, children, ...data }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * RANGE, -speed * RANGE]);
  const active = reduce === false && (mobile || wide);

  return (
    <motion.div ref={ref} data-parallax="" style={active ? { y } : undefined} className={className} {...data}>
      {children}
    </motion.div>
  );
}
