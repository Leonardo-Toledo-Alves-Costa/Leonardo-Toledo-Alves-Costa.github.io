import { Chip } from "@/components/ui/Chip";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { skills } from "@/content/skills";
import type { Project } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";
import { localize } from "@/lib/content";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Card de projeto: o que é, o que foi entregue, com que stack e se o código é privado. */
export function ProjectCard({ project, locale, dict, featured }: { project: Project; locale: Locale; dict: Dictionary; featured?: boolean }) {
  const t = dict.projects;
  const stack = project.skills.map((id) => skills.find((s) => s.id === id)).filter((s) => s !== undefined);

  return (
    <article data-project-card={project.id} className="h-full">
      <SpotlightCard className={cn("flex h-full flex-col gap-5 sm:p-7", featured && "border-signal/30 before:opacity-80")}>
        {/* Destaque: a placa aparece no canto do card (preenche o miolo de 2 colunas com intenção). */}
        {featured && (
          <div
            aria-hidden
            className="pcb-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_85%_80%,#000_10%,transparent_60%)]"
          />
        )}
        <header>
          {/* Faixa de metadados: mesma altura em todos os cards da fileira. */}
          <div className="flex min-h-8 flex-wrap items-center justify-between gap-2">
            {project.award ? (
              <p
                data-award=""
                className="silkscreen inline-flex w-fit items-center rounded-2xl border border-signal/35 bg-signal/10 px-3.5 py-1.5 text-signal sm:rounded-pill"
              >
                {project.award[locale]}
              </p>
            ) : (
              <span />
            )}
            {project.visibility === "private" && (
              <span data-private="" className="font-mono text-xs text-text-2">
                {t.privateCode}
              </span>
            )}
          </div>
          <h3 className={cn("mt-3 font-bold tracking-[-0.02em]", featured ? "text-3xl sm:text-4xl" : "text-2xl")}>{project.name}</h3>
          <p className="mt-1 text-text-2">{project.tagline[locale]}</p>
        </header>
        <p className={cn("leading-relaxed text-pretty text-text/85", featured && "max-w-[60ch] sm:text-lg")}>{project.description[locale]}</p>
        <footer className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-2">
          {stack.length > 0 && (
            <ul aria-label={t.stack} className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <li key={s.id}>
                  <Chip level={s.level}>{localize(s.name, locale)}</Chip>
                </li>
              ))}
            </ul>
          )}
          {(project.links?.repo || project.links?.demo) && (
            <div className="ml-auto flex items-center gap-4">
              {project.links?.repo && (
                <a
                  href={project.links.repo}
                  aria-label={`GitHub — ${project.name}`}
                  {...external}
                  className="inline-flex min-h-11 items-center text-sm text-text underline underline-offset-4"
                >
                  GitHub
                </a>
              )}
              {project.links?.demo && (
                <a
                  href={project.links.demo}
                  aria-label={`Demo — ${project.name}`}
                  {...external}
                  className="inline-flex min-h-11 items-center text-sm text-text underline underline-offset-4"
                >
                  Demo
                </a>
              )}
            </div>
          )}
        </footer>
      </SpotlightCard>
    </article>
  );
}
