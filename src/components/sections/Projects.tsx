import { Reveal } from "@/components/motion/Reveal";
import { projects } from "@/content/projects";
import { projectSlots, slotsToFillGrid } from "@/lib/content";
import { ProjectCard } from "./projects/ProjectCard";
import { Section } from "./Section";
import type { SectionProps } from "./types";

const COLS = 3;

/** Projetos como módulos da placa: o premiado em destaque (2 colunas) e "slots livres" fechando a grade. */
export function Projects({ locale, dict }: SectionProps) {
  const t = dict.projects;
  const featuredId = projects.find((p) => p.award)?.id;
  const items = projectSlots(projects, slotsToFillGrid(projects.length, COLS, featuredId ? 1 : 0));

  return (
    <Section id="projects" index="05" label={dict.nav.projects} title={dict.sections.projects}>
      <p className="mt-6 max-w-[60ch] text-lg text-text-2">{t.intro}</p>
      {/* Um Reveal para a grade inteira: cards não são sequência. */}
      <Reveal className="mt-12">
        <ul className="grid gap-4 md:grid-flow-dense md:grid-cols-3">
          {items.map((project, i) =>
            project ? (
              <li key={project.id} className={project.id === featuredId ? "md:col-span-2" : undefined}>
                <ProjectCard project={project} locale={locale} dict={dict} featured={project.id === featuredId} />
              </li>
            ) : (
              // Slot livre: parte do desenho (a placa tem espaço para o próximo módulo), não um buraco.
              <li
                key={`slot-${i}`}
                data-slot=""
                className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-card border border-dashed border-white/20 bg-surface-1/40 p-6 text-center font-mono text-xs text-text-2"
              >
                <span className="tracking-[0.14em] uppercase">[ {t.slotTitle} ]</span>
                <span>{t.slotBody}</span>
              </li>
            ),
          )}
        </ul>
      </Reveal>
    </Section>
  );
}
