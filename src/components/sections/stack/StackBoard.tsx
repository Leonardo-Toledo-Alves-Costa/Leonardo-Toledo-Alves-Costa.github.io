"use client";

import { useState } from "react";
import { CircuitTraces } from "@/components/motion/CircuitTraces";
import { Chip } from "@/components/ui/Chip";
import type { SkillCategory, SkillLevel } from "@/content/types";
import { cn } from "@/lib/cn";
import { SkillDetail } from "./SkillDetail";

export type BoardSkill = { id: string; name: string; level: SkillLevel; context?: string; projects: string[] };
export type BoardZone = { id: SkillCategory; label: string; skills: BoardSkill[] };

type StackBoardProps = {
  zones: BoardZone[];
  initialId: string;
  levelLabels: Record<SkillLevel, string>;
  labels: { level: string; usedIn: string; noProjects: string };
};

// Desktop: zonas nos cantos, detalhe no centro (as trilhas da placa ligam as bordas internas das zonas ao centro).
const AREA: Record<SkillCategory, string> = {
  software: "lg:[grid-area:software]",
  cloud: "lg:[grid-area:cloud]",
  engineering: "lg:[grid-area:engineering]",
  "hardware-ai": "lg:[grid-area:hardware]",
};

/** Placa interativa: chips por categoria; selecionar acende a trilha da zona e mostra o detalhe. */
export function StackBoard({ zones, initialId, levelLabels, labels }: StackBoardProps) {
  const [selectedId, setSelectedId] = useState(initialId);
  const zoneIndex = Math.max(0, zones.findIndex((z) => z.skills.some((s) => s.id === selectedId)));
  const zone = zones[zoneIndex];
  const skill = zone?.skills.find((s) => s.id === selectedId) ?? zone?.skills[0];

  return (
    <div className="relative mt-12">
      {/* Trilhas só no desktop, onde o layout tem a forma da placa. */}
      <CircuitTraces
        variant="board"
        activeIds={zone && skill ? [zone.id] : []}
        className="absolute inset-0 hidden lg:block"
      />
      <div
        className={cn(
          "relative grid gap-4",
          "lg:grid-cols-[1fr_minmax(280px,0.9fr)_1fr] lg:gap-x-16 lg:gap-y-16",
          "lg:[grid-template-areas:'software_detail_cloud''engineering_detail_hardware']",
        )}
      >
        {zones.map((z, i) => {
          const isActive = Boolean(skill && z.id === zone?.id);
          return (
            <div
              key={z.id}
              data-zone={z.id}
              // No celular, a ordem coloca o detalhe logo depois da zona escolhida.
              style={{ order: i * 2 }}
              // Opaca: as trilhas não vazam por baixo dos chips.
              className={cn(
                "rounded-panel border bg-surface-1 p-4 transition-colors duration-300 sm:p-5 lg:order-none",
                AREA[z.id],
                isActive ? "border-signal/40" : "border-line",
              )}
            >
              <h3 className={cn("silkscreen", isActive ? "text-signal" : "text-text-2")}>[{z.label}]</h3>
              <div className="mt-3 flex flex-wrap gap-x-2 gap-y-3">
                {z.skills.map((s) => (
                  <Chip key={s.id} level={s.level} selected={s.id === skill?.id} onClick={() => setSelectedId(s.id)}>
                    {s.name}
                  </Chip>
                ))}
              </div>
            </div>
          );
        })}

        <div
          data-testid="stack-detail"
          aria-live="polite"
          aria-atomic="true"
          style={{ order: zoneIndex * 2 + 1 }}
          className="lg:order-none lg:self-center lg:[grid-area:detail]"
        >
          {skill && zone && <SkillDetail skill={skill} zoneLabel={zone.label} levelLabels={levelLabels} labels={labels} />}
        </div>
      </div>
    </div>
  );
}
