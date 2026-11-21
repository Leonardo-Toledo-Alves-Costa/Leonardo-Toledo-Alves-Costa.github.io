import { cn } from "@/lib/cn";
import { panelId, type SkillItem } from "./skill-item";

/** Painel com os projetos que usam a skill. */
export function SkillPanel({ skill, usedInLabel, open, className }: { skill: SkillItem; usedInLabel: string; open: boolean; className?: string }) {
  return (
    <div
      id={panelId(skill.id)}
      data-skill-panel=""
      hidden={!open}
      className={cn("glass w-max max-w-[min(16rem,calc(100vw-2rem))] rounded-card px-4 py-3 text-left text-sm", className)}
    >
      <p className="font-mono text-xs tracking-[0.14em] text-ink-dim uppercase">{usedInLabel}</p>
      <ul className="mt-1.5 flex flex-col gap-1 text-ink">
        {skill.projects.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
