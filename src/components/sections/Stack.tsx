import { skills } from "@/content/skills";
import { localize } from "@/lib/content";
import { Section } from "./Section";
import type { SectionProps } from "./types";

// Estrutura inicial (Task 7); a placa interativa vem na Task 10.
export function Stack({ locale, dict }: SectionProps) {
  return (
    <Section id="stack" index="03" label={dict.nav.stack} title={dict.sections.stack}>
      <p className="mt-6 max-w-[60ch] text-text-2">{skills.map((s) => localize(s.name, locale)).join(" · ")}</p>
    </Section>
  );
}
