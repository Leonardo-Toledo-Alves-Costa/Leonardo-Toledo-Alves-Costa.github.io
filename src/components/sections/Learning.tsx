import { learning } from "@/content/learning";
import { Section } from "./Section";
import type { SectionProps } from "./types";

// Estrutura inicial (Task 7); as barras de build vêm na Task 13.
export function Learning({ locale, dict }: SectionProps) {
  if (learning.length === 0) return null;
  return (
    <Section tone="raised" id="learning" index="06" label={dict.nav.learning} title={dict.sections.learning}>
      <ul className="mt-6 grid gap-2 text-text-2">
        {learning.map((l) => (
          <li key={l.id}>
            {l.topic[locale]} — {l.why[locale]}
          </li>
        ))}
      </ul>
    </Section>
  );
}
