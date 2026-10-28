import { projects } from "@/content/projects";
import { Section } from "./Section";
import type { SectionProps } from "./types";

// Estrutura inicial (Task 7); os cards vêm na Task 12.
export function Projects({ locale, dict }: SectionProps) {
  return (
    <Section id="projects" index="05" label={dict.nav.projects} title={dict.sections.projects}>
      <ul className="mt-6 grid gap-2 text-text-2">
        {projects.map((p) => (
          <li key={p.id}>
            {p.name} — {p.tagline[locale]}
          </li>
        ))}
      </ul>
    </Section>
  );
}
