import { Chip } from "@/components/ui/Chip";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { SkillCategory, SkillLevel } from "@/content/types";
import { localize, skillCategories, skillsByCategory } from "@/lib/content";
import { Section } from "./Section";
import { StackBoard, type BoardZone } from "./stack/StackBoard";
import type { SectionProps } from "./types";

const LEVELS: SkillLevel[] = ["learning", "used", "proficient"];
const CATEGORY_KEY: Record<SkillCategory, "software" | "cloud" | "engineering" | "hardwareAi"> = {
  software: "software",
  cloud: "cloud",
  engineering: "engineering",
  "hardware-ai": "hardwareAi",
};

/** Stack como placa de circuito: amplitude técnica com níveis honestos (seção principal do site). */
export function Stack({ locale, dict }: SectionProps) {
  const t = dict.stack;
  const grouped = skillsByCategory(skills);
  const zones: BoardZone[] = skillCategories.map((id) => ({
    id,
    label: t.categories[CATEGORY_KEY[id]],
    skills: grouped[id].map((s) => ({
      id: s.id,
      name: localize(s.name, locale),
      level: s.level,
      context: s.context ? localize(s.context, locale) : undefined,
      projects: projects.filter((p) => p.skills.includes(s.id)).map((p) => p.name),
    })),
  }));
  const initialId = skills.find((s) => s.level === "proficient")?.id ?? skills[0]?.id ?? "";

  return (
    <Section id="stack" index="03" label={dict.nav.stack} title={dict.sections.stack}>
      <p className="mt-6 max-w-[60ch] text-lg text-text-2">{t.intro}</p>
      <div data-testid="stack-legend" aria-label={t.legend} role="group" className="mt-6 flex flex-wrap gap-2">
        {LEVELS.map((level) => (
          <Chip key={level} level={level}>
            {dict.levels[level]}
          </Chip>
        ))}
      </div>
      <StackBoard
        zones={zones}
        initialId={initialId}
        levelLabels={dict.levels}
        labels={{ level: t.level, usedIn: t.usedIn, noProjects: t.noProjects }}
      />
    </Section>
  );
}
