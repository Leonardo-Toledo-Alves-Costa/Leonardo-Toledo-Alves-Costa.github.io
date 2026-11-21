"use client";

import { type MotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useState } from "react";
import { ScrollStage } from "@/components/motion/ScrollStage";
import { Container } from "@/components/ui/Container";
import { LEVEL_DOT } from "@/components/ui/Pill";
import { SerifStatement } from "@/components/ui/SerifStatement";
import type { SkillLevel } from "@/content/types";
import { cn } from "@/lib/cn";
import { Chevron } from "./Chevron";
import { SkillPanel } from "./SkillPanel";
import { SkillPill } from "./SkillPill";
import type { PanelPlacement, SkillItem } from "./skill-item";

export type StackGroup = { category: string; label: string; skills: SkillItem[] };

type StackBeatsProps = {
  groups: StackGroup[];
  /** Frase F5 (marcação {{ }}). */
  statement: string;
  levels: Record<SkillLevel, string>;
  legendLabel: string;
  usedInLabel: string;
  /** Dica de que as pílulas com ▾ abrem os projetos. */
  hint: string;
};

/** Batida ativa: floor(progresso × n), limitada à última. */
function beatOf(v: number, n: number) {
  return Math.min(n - 1, Math.max(0, Math.floor(v * n)));
}

function useActiveBeat(progress: MotionValue<number>, n: number) {
  const [active, setActive] = useState(() => beatOf(progress.get(), n));
  useMotionValueEvent(progress, "change", (v) => setActive(beatOf(v, n)));
  return active;
}

/**
 * Posição de cada pílula em volta da frase, determinística por índice e batida. Base: elipse com as
 * pílulas igualmente espaçadas; batidas ímpares giram meia fatia (o grupo que recua não fica atrás
 * do que chega). Um desvio leve e fixo de raio e ângulo tira a cara de gráfico radial (insp. 1).
 */
function ringPosition(i: number, n: number, beat: number) {
  const deg = -90 + (360 / n) * (i + (beat % 2) / 2) + 7 * Math.sin(i * 2.3 + beat);
  const r = 1 + 0.06 * Math.sin(i * 1.7 + beat * 0.9);
  const a = (deg * Math.PI) / 180;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
}

function Legend({ levels, label, hint, className }: { levels: Record<SkillLevel, string>; label: string; hint: string; className?: string }) {
  return (
    <div data-stack-legend="" className={cn("flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-dim", className)}>
      <span className="sr-only">{label}:</span>
      {(["proficient", "used", "learning"] as const).map((level) => (
        <span key={level} className="inline-flex items-center gap-2">
          <span aria-hidden className={cn("size-2 rounded-full", LEVEL_DOT[level])} />
          {levels[level]}
        </span>
      ))}
      {/* A dica não é um nível: separada por um traço fino. */}
      <span className="inline-flex items-center gap-2 sm:border-l sm:border-line sm:pl-5">
        <Chevron className="text-ink-dim" />
        {hint}
      </span>
    </div>
  );
}

const index = (g: number, n: number) => `${String(g + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;

/**
 * Stack em 4 batidas (spec §6.2 item 2, insp. Superconscious): a frase F5 fica fixa no centro e, a cada
 * batida da rolagem, um grupo de pílulas chega voando até a volta dela; o anterior recua desfocado.
 * Sem JS, com "reduzir movimento" ou no celular: quatro blocos normais, todos focáveis.
 */
export function StackBeats(props: StackBeatsProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  // Painel fecha com Esc (foco volta à pílula) e com clique fora.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenId(null);
      document.querySelector<HTMLElement>(`[data-skill="${openId}"]`)?.focus();
    };
    const onDown = (e: PointerEvent) => {
      // Dentro da pílula ou do próprio painel (que no celular fica abaixo da linha) não fecha.
      if (!(e.target instanceof Element) || !e.target.closest("[data-skill-wrap], [data-skill-panel]")) setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [openId]);

  return (
    <ScrollStage heightVh={400} sticky="desktop" data-stack-stage="">
      {(progress, animated) => <Beats {...props} progress={progress} animated={animated} openId={openId} setOpenId={setOpenId} />}
    </ScrollStage>
  );
}

type BeatsProps = StackBeatsProps & {
  progress: MotionValue<number>;
  animated: boolean;
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

function Beats({ progress, animated, groups, statement, levels, legendLabel, usedInLabel, hint, openId, setOpenId }: BeatsProps) {
  const active = useActiveBeat(progress, groups.length);
  // Trocou de batida: o painel aberto (de uma pílula que vai recuar) fecha.
  useEffect(() => setOpenId(null), [active, setOpenId]);

  const pill = (skill: SkillItem, placement: PanelPlacement) => (
    <SkillPill
      key={skill.id}
      skill={skill}
      levelLabel={levels[skill.level]}
      usedInLabel={usedInLabel}
      open={openId === skill.id}
      onToggle={() => setOpenId(openId === skill.id ? null : skill.id)}
      placement={placement}
    />
  );

  if (!animated) {
    // Fluxo normal: frase, legenda e quatro blocos. No celular cada bloco ocupa ~70% da tela, ancorado no topo
    // (o painel abre para baixo sem empurrar a linha de pílulas para cima).
    return (
      <Container className="flex flex-col items-center py-10 text-center">
        <SerifStatement text={statement} className="max-w-[18ch]" />
        <Legend levels={levels} label={legendLabel} hint={hint} className="mt-8" />
        <div className="mt-6 flex w-full flex-col">
          {groups.map((group, g) => (
            <div key={group.category} data-beat={group.category} data-state="static" className="flex flex-col items-center border-t border-line py-10 first:border-t-0 max-md:min-h-[70svh] max-md:pt-16">
              <p aria-hidden className="font-mono text-xs tracking-[0.14em] text-ink-dim">
                {index(g, groups.length)}
              </p>
              <h3 className="mt-2 text-xl font-normal tracking-[-0.015em] text-ink sm:text-2xl">{group.label}</h3>
              <div className="mt-6 flex max-w-3xl flex-wrap items-start justify-center gap-2">{group.skills.map((s) => pill(s, "flow"))}</div>
              {/* Painel abaixo da linha inteira: abrir não alarga a pílula nem empurra as vizinhas. */}
              {group.skills
                .filter((s) => s.projects.length > 0)
                .map((s) => (
                  <SkillPanel key={s.id} skill={s} usedInLabel={usedInLabel} open={openId === s.id} className="mt-4" />
                ))}
            </div>
          ))}
        </div>
      </Container>
    );
  }

  return (
    // Raio da elipse descontando meia pílula longa (~130px): nada encosta na borda de 768 a 1440px.
    <div className="relative h-svh w-full overflow-hidden [--rx:min(29vw,500px)] [--ry:min(30vh,280px)]">
      {/* Coluna central: índice + nome da categoria ativa acima da frase F5. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="relative h-6 w-full">
          {groups.map((group, g) => (
            <p
              key={group.category}
              aria-hidden={g !== active}
              className={cn("absolute inset-x-0 text-sm text-ink transition-opacity duration-500", g === active ? "opacity-100" : "opacity-0")}
            >
              <span className="font-mono text-xs tracking-[0.14em] text-ink-dim">{index(g, groups.length)}</span>
              <span className="ml-3">{group.label}</span>
            </p>
          ))}
        </div>
        <SerifStatement text={statement} className="mt-5 max-w-[15ch]" />
      </div>

      {groups.map((group, g) => {
        // Só a batida imediatamente anterior recua visível; as mais antigas já saíram.
        const state = g === active ? "active" : g === active - 1 ? "past" : g < active ? "gone" : "future";
        // Quem ainda vai entrar espera mais longe; quem recua se afasta um pouco (fora do anel da ativa).
        const k = state === "future" ? 1.6 : state === "active" ? 1 : 1.25;
        return (
          <div
            key={group.category}
            data-beat={group.category}
            data-state={state}
            inert={state !== "active"}
            className={cn(
              // A ativa sempre por cima das que entram ou saem (também durante a transição).
              // A camada cobre o palco inteiro mas não recebe clique: só as pílulas recebem.
              "pointer-events-none absolute inset-0 transition-[opacity,transform,filter] duration-700 ease-abissal",
              state === "active" ? "z-20 opacity-100" : "z-0",
              (state === "past" || state === "gone") && "scale-90 blur-[4px]",
              state === "past" && "opacity-25",
              (state === "future" || state === "gone") && "opacity-0",
            )}
          >
            {/* Título acessível do grupo (o visível fica na coluna central). */}
            <h3 className="sr-only">{group.label}</h3>
            {group.skills.map((skill, i) => {
              const { x, y } = ringPosition(i, group.skills.length, g);
              const open = openId === skill.id;
              return (
                <div
                  key={skill.id}
                  // Painel aberto acima de todas as outras pílulas e da legenda.
                  className={cn(
                    "absolute top-1/2 left-1/2 transition-transform duration-700 ease-abissal",
                    state === "active" && "pointer-events-auto",
                    open ? "z-30" : "z-10",
                  )}
                  style={{
                    transform: `translate(calc(-50% + ${(x * k).toFixed(3)} * var(--rx)), calc(-50% + ${(y * k).toFixed(3)} * var(--ry)))`,
                    transitionDelay: state === "active" ? `${i * 45}ms` : "0ms",
                  }}
                >
                  {/* Painel para fora da elipse: abre para baixo (há espaço até a legenda), exceto nas pílulas
                      do fundo, que abrem para cima; os lados crescem para fora (longe da frase). */}
                  {pill(skill, { v: y > 0.9 ? "up" : "down", h: x > 0.3 ? "start" : x < -0.3 ? "end" : "center" })}
                </div>
              );
            })}
          </div>
        );
      })}

      <Legend levels={levels} label={legendLabel} hint={hint} className="absolute inset-x-0 bottom-8" />
    </div>
  );
}
