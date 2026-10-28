import { SpotlightCard } from "@/components/ui/SpotlightCard";
import type { SkillLevel } from "@/content/types";
import { cn } from "@/lib/cn";
import type { BoardSkill } from "./StackBoard";

type SkillDetailProps = {
  skill: BoardSkill;
  zoneLabel: string;
  levelLabels: Record<SkillLevel, string>;
  labels: { level: string; usedIn: string; noProjects: string };
};

/** Painel da tecnologia selecionada: nível honesto e onde foi usada (ou "sem projeto listado"). */
export function SkillDetail({ skill, zoneLabel, levelLabels, labels }: SkillDetailProps) {
  return (
    // Fundo opaco (padrão do SpotlightCard): as trilhas da placa não atravessam o painel.
    <SpotlightCard>
      <p className="silkscreen text-signal">{zoneLabel}</p>
      <p className="mt-2 text-2xl font-bold tracking-[-0.02em]">{skill.name}</p>
      {skill.context && <p className="mt-2 text-sm text-text-2">{skill.context}</p>}
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="text-text-2">{labels.level}</dt>
          <dd className={cn("mt-0.5 font-mono", skill.level === "proficient" ? "text-signal" : "text-text")}>
            {levelLabels[skill.level]}
          </dd>
        </div>
        <div>
          <dt className="text-text-2">{labels.usedIn}</dt>
          <dd className="mt-0.5">
            {skill.projects.length > 0 ? (
              <ul className="flex flex-wrap gap-x-4">
                {skill.projects.map((p) => (
                  <li key={p} data-project="">
                    <a
                      href="#projects"
                      className="inline-flex min-h-11 items-center text-text underline decoration-text-2/60 underline-offset-4 hover:decoration-signal"
                    >
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-text-2">{labels.noProjects}</span>
            )}
          </dd>
        </div>
      </dl>
    </SpotlightCard>
  );
}
