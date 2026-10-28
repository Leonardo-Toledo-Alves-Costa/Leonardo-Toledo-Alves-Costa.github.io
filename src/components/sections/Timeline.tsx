import { timeline } from "@/content/timeline";
import { Section } from "./Section";
import type { SectionProps } from "./types";

// Estrutura inicial (Task 7); o "git log" vem na Task 11.
export function Timeline({ locale, dict }: SectionProps) {
  return (
    <Section tone="raised" id="timeline" index="04" label={dict.nav.timeline} title={dict.sections.timeline}>
      <ul className="mt-6 grid gap-2 text-text-2">
        {timeline.map((t) => (
          <li key={t.id}>
            {t.role[locale]} — {t.org}
          </li>
        ))}
      </ul>
    </Section>
  );
}
