"use client";

import { type MotionStyle, motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Orb } from "@/components/motion/Orb";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Hero + Expansão compartilham um único orbe (spec §5.2): ele fica numa camada fixa (sticky) que
 * atravessa os dois blocos, cresce até cobrir a tela ("eclipse") e escurece pelo `expand` do shader.
 * Sem JS ou com "reduzir movimento", o orbe fica parado no tamanho do hero.
 */
export function OpeningStage({ hero, expansion }: { hero: ReactNode; expansion: ReactNode }) {
  const expansionRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  // 0 quando a expansão começa a entrar por baixo (primeira rolagem), 1 quando ela termina.
  const { scrollYProgress } = useScroll({ target: expansionRef, offset: ["start end", "end end"] });
  // Cresce até ~4× (a borda acesa continua à vista, como no protótipo) e desce até o centro da tela,
  // onde fica a frase: --orb-shift é a distância do centro do orbe em repouso até o meio da tela.
  // No celular a tela é estreita: cresce menos para a borda acesa continuar visível nas laterais.
  const [grow, setGrow] = useState(3.2);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const update = () => setGrow(wide.matches ? 3.2 : 1.4);
    update();
    wide.addEventListener("change", update);
    return () => wide.removeEventListener("change", update);
  }, []);
  const scale = useTransform(scrollYProgress, (p) => 1 + grow * p);
  // Chega ao centro quando a frase termina de entrar (~75% do caminho) e fica lá.
  const y = useTransform(scrollYProgress, (p) => `calc(var(--orb-shift) * ${Math.min(1, p / 0.75)})`);
  // Some só no fim do palco da frase (mesmo progresso dela), nunca enquanto F1 está em leitura.
  const { scrollYProgress: stageProgress } = useScroll({ target: expansionRef, offset: ["start start", "end end"] });
  const opacity = useTransform(stageProgress, [0.8, 1], [1, 0]);
  const animated = reduce === false;

  return (
    <div data-opening="" className="relative [--orb-shift:30svh] [--orb:min(30vh,56vw)] xl:[--orb-shift:8svh] xl:[--orb:min(36vh,62vw)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 xl:top-[42%]">
            {/* --orb-expand alimenta a camada CSS (sem WebGL); o shader recebe o mesmo valor por expand. */}
            <motion.div style={animated ? ({ scale, y, opacity, "--orb-expand": scrollYProgress } as MotionStyle) : undefined}>
              <Orb
                variant="hero"
                size="w-(--orb)"
                expand={animated ? scrollYProgress : undefined}
                className="animate-orb-in [animation-delay:200ms] motion-reduce:animate-none"
              />
            </motion.div>
          </div>
        </div>
      </div>
      {hero}
      <div ref={expansionRef}>{expansion}</div>
    </div>
  );
}
