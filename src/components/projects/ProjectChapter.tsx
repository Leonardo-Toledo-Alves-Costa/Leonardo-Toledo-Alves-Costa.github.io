"use client";

import { motion, type MotionValue, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { ScrollStage } from "@/components/motion/ScrollStage";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pill } from "@/components/ui/Pill";
import type { SkillLevel } from "@/content/types";
import { cn } from "@/lib/cn";

export type ChapterData = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  role?: string;
  award?: string;
  skills: { id: string; name: string; level: SkillLevel }[];
  /** Espaço visual: imagem real, diagrama (Task 19) ou nada. */
  visual: { kind: "media"; src: string; alt: string } | { kind: "diagram" } | { kind: "none" };
};

type ChapterLabels = { role: string; delivery: string; award: string; stack: string };

type ProjectChapterProps = {
  chapter: ChapterData;
  index: number;
  total: number;
  labels: ChapterLabels;
  levels: Record<SkillLevel, string>;
  /** Diagrama do projeto (Task 19), quando existir. */
  diagram?: ReactNode;
};

type CardProps = {
  progress: MotionValue<number>;
  animated: boolean;
  order: number;
  kind: string;
  label: string;
  /** Destaque discreto (prêmio): borda e ponto na luz cobalto. */
  accent?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Cartão que entra e sai com o progresso do capítulo (escalonado pela ordem): entra no começo do palco e
 * sai no fim, quando o capítulo vai embora. Só no modo animado; sem JS, com reduzir movimento ou no
 * celular fica parado e visível.
 */
function Card({ progress, animated, order, kind, label, accent, className, children }: CardProps) {
  const start = order * 0.06;
  const opacity = useTransform(progress, [start, start + 0.25, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.25, 0.85, 1], [36, 0, 0, -24]);
  return (
    // Fora do modo animado, valores fixos (não `undefined`): ao estreitar a janela, o motion não deixa o
    // último valor animado (opacidade 0 no fim do palco) preso no estilo inline.
    <motion.div data-card={kind} style={animated ? { opacity, y } : { opacity: 1, y: 0 }} className={className}>
      <GlassCard
        className={cn(
          // Destaque mantém o brilho especular e a sombra do vidro (.glass) e soma a luz cobalto.
          accent &&
            "border-accent-hi/40 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_30px_60px_-30px_rgb(0_0_0/0.8),0_0_32px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]",
        )}
      >
        <p className="font-mono text-xs tracking-[0.14em] text-ink-dim uppercase">
          {accent && <span aria-hidden className="mr-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-ink shadow-[0_0_10px_var(--color-accent)]" />}
          {label}
        </p>
        <div className="mt-3">{children}</div>
      </GlassCard>
    </motion.div>
  );
}

/**
 * Capítulo de um projeto em /projetos (spec §6.2 item 3, insp. Superconscious): nome grande + tagline
 * apagada à esquerda; em volta, cartões de vidro com dados reais — papel (só com fonte), stack, entregas
 * (a descrição) e prêmio (só se houver). Espaço visual só com imagem ou diagrama (nunca vazio).
 * Desktop (≥ 768px): palco de 150 vh com tela fixa e cartões entrando e saindo; celular, sem JS ou
 * reduzir movimento: bloco normal.
 */
export function ProjectChapter({ chapter, index, total, labels, levels, diagram }: ProjectChapterProps) {
  return (
    <ScrollStage heightVh={150} sticky="desktop" data-chapter={chapter.id}>
      {(progress, animated) => {
        let order = 0;
        // Stack ocupa 2 colunas quando papel e prêmio vêm juntos (ou nenhum dos dois); com só um, divide a linha.
        const stackWide = Boolean(chapter.role) === Boolean(chapter.award);
        return (
          // Duas colunas a partir de md, o mesmo ponto em que o palco fixa (sticky="desktop").
          // Fora do modo animado: respiro e um traço fino entre capítulos.
          <Container
            className={cn(
              "grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-12 lg:gap-16",
              !animated && "py-16 sm:py-20",
              !animated && index > 0 && "border-t border-line",
            )}
          >
            <div>
              <p aria-hidden className="font-mono text-xs tracking-[0.14em] text-ink-dim">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
              {/* Ponto de quebra depois de "/" (ex.: "Moodle/TecCurar" não pode invadir a coluna dos cartões). */}
              <h3 className="mt-3 text-[clamp(40px,5.2vw,84px)] leading-[0.95] font-normal tracking-[-0.045em] text-balance text-ink">
                {chapter.name.split("/").flatMap((part, i) => (i === 0 ? [part] : [<span key={i}>/<wbr /></span>, part]))}
              </h3>
              <p data-tagline="" className="mt-4 max-w-[28ch] text-lg text-pretty text-ink-dim sm:text-xl">
                {chapter.tagline}
              </p>
              {chapter.visual.kind === "media" && (
                <div data-visual="media" className="mt-8 aspect-[16/10] overflow-hidden rounded-card border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element -- export estático: sem otimizador de imagem */}
                  <img src={chapter.visual.src} alt={chapter.visual.alt} loading="lazy" width={1280} height={800} className="size-full object-cover" />
                </div>
              )}
              {chapter.visual.kind === "diagram" && diagram && (
                <div data-visual="diagram" className="mt-8">
                  {diagram}
                </div>
              )}
            </div>

            <div className="grid items-start gap-4 lg:grid-cols-2">
              {chapter.role && (
                <Card progress={progress} animated={animated} order={order++} kind="role" label={labels.role}>
                  <p className="text-lg text-balance text-ink sm:text-xl">{chapter.role}</p>
                </Card>
              )}
              {chapter.award && (
                <Card progress={progress} animated={animated} order={order++} kind="award" label={labels.award} accent>
                  <p className="text-lg text-balance text-ink sm:text-xl">{chapter.award}</p>
                </Card>
              )}
              <Card progress={progress} animated={animated} order={order++} kind="stack" label={labels.stack} className={cn(stackWide && "lg:col-span-2")}>
                <ul className="flex flex-wrap gap-2">
                  {chapter.skills.map((skill) => (
                    <li key={skill.id}>
                      <Pill level={skill.level} levelLabel={levels[skill.level]}>
                        {skill.name}
                      </Pill>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card progress={progress} animated={animated} order={order++} kind="delivery" label={labels.delivery} className="lg:col-span-2">
                {/* O que foi entregue é o dado principal: aceso (o cinza-azulado é só o rótulo). */}
                <p className="text-base leading-relaxed text-pretty text-ink sm:text-lg">{chapter.description}</p>
              </Card>
            </div>
          </Container>
        );
      }}
    </ScrollStage>
  );
}
