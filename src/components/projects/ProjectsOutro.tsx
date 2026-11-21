import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Fechamento de /projetos (spec §6.2 item 4): painel de contato e o caminho de volta ao início. */
export function ProjectsOutro({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section data-projects-outro="" aria-labelledby="projects-outro-title" className="py-24 sm:py-32">
      <Container className="flex flex-col items-center">
        <GlassCard className="flex w-full max-w-2xl flex-col items-center p-6 text-center sm:p-12">
          <h2 id="projects-outro-title" className="max-w-[22ch] text-2xl font-normal tracking-[-0.025em] text-balance sm:text-4xl">
            {dict.sections.contact}
          </h2>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex min-h-11 items-center text-base text-ink sm:text-lg underline decoration-ink-dim/60 underline-offset-[6px] [overflow-wrap:anywhere] hover:decoration-accent-hi"
          >
            {profile.email}
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href={profile.links.linkedin} variant="ghost" icon="arrow" {...external}>
              LinkedIn
            </Button>
            <Button href={profile.links.github} variant="ghost" icon="arrow" {...external}>
              GitHub
            </Button>
          </div>
        </GlassCard>
        <Button href={`/${locale}/`} variant="ghost" className="mt-12" data-back-home="">
          {dict.projectsPage.backHome}
        </Button>
      </Container>
    </section>
  );
}
