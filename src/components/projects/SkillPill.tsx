import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { Chevron } from "./Chevron";
import { SkillPanel } from "./SkillPanel";
import { panelId, type PanelPlacement, type SkillItem } from "./skill-item";

export type { PanelPlacement, SkillItem } from "./skill-item";

type SkillPillProps = {
  skill: SkillItem;
  levelLabel: string;
  usedInLabel: string;
  open: boolean;
  onToggle: () => void;
  placement: PanelPlacement;
};

/**
 * Pílula de uma skill em /projetos (spec §6.2): botão (com seta) só se a skill aparece em algum projeto —
 * abre um painel com a lista dos projetos; as demais são texto, sem estado vazio.
 */
export function SkillPill({ skill, levelLabel, usedInLabel, open, onToggle, placement }: SkillPillProps) {
  if (skill.projects.length === 0) {
    return (
      <Pill level={skill.level} levelLabel={levelLabel} data-skill={skill.id}>
        {skill.name}
      </Pill>
    );
  }
  return (
    <div data-skill-wrap="" className="relative inline-flex">
      <Pill
        as="button"
        level={skill.level}
        levelLabel={levelLabel}
        lit={open}
        data-skill={skill.id}
        aria-expanded={open}
        aria-controls={panelId(skill.id)}
        onClick={onToggle}
      >
        <span>{skill.name}</span>
        <Chevron className={cn("ml-1.5 text-ink-dim transition-transform duration-200", open && "rotate-180")} />
      </Pill>
      {placement !== "flow" && (
        <SkillPanel
          skill={skill}
          usedInLabel={usedInLabel}
          open={open}
          className={cn(
            "absolute z-10",
            placement.v === "up" ? "bottom-full mb-2" : "top-full mt-2",
            placement.h === "center" && "left-1/2 -translate-x-1/2",
            placement.h === "start" && "left-0",
            placement.h === "end" && "right-0",
          )}
        />
      )}
    </div>
  );
}
