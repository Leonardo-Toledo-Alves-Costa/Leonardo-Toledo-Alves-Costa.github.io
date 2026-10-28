"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Entrada suave ao aparecer na tela. O HTML estático sai VISÍVEL (sem JS e para buscadores):
 * só elementos que estão abaixo da dobra no momento da hidratação são escondidos e revelados ao rolar.
 * Com "reduzir movimento", nada é escondido.
 */
export function Reveal({ delay = 0, className, children }: { delay?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce !== false) return;
    // Só arma o efeito para o que ainda não está visível: nada some da tela depois de carregar.
    // Mede o layout, então precisa rodar depois de montar.
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [reduce]);

  const hidden = armed && !inView;
  return (
    <motion.div
      ref={ref}
      data-reveal=""
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
      // Esconder é instantâneo; só a entrada anima.
      transition={{ duration: hidden ? 0 : 0.7, ease: [0.2, 0.8, 0.2, 1], delay: hidden ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
