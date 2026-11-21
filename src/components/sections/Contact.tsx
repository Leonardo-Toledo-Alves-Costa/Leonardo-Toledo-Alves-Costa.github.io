import { Orb } from "@/components/motion/Orb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SerifStatement } from "@/components/ui/SerifStatement";
import { profile } from "@/content/profile";
import { CopyEmail } from "./contact/CopyEmail";
import type { SectionProps } from "./types";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * Contato (spec §5.7, insp. Lunetra painel 4): fechamento centrado. Mini-orbe ao fundo (só CSS),
 * frase F3 em serifa, e-mail (link mailto + copiar, que exige JS), LinkedIn e GitHub em botões de
 * contorno. Currículo só quando houver PDF sem telefone (profile.cv). Sem telefone.
 */
export function Contact({ locale, dict }: SectionProps) {
  const t = dict.contact;
  const cv = profile.cv?.[locale];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-24 overflow-x-clip py-24 sm:py-28">
      <Container className="flex flex-col items-center text-center">
        {/* Orbe acima da frase, com respiro do halo: nenhum texto sobre o núcleo de luz. */}
        <Orb variant="mini" size="w-20 sm:w-24" />
        <SerifStatement text={dict.statements.f3} className="mt-16 max-w-[18ch]" />

        <SectionLabel index="05" className="mt-14">
          {dict.nav.contact}
        </SectionLabel>
        <h2 id="contact-title" className="mt-4 max-w-[22ch] text-2xl font-normal tracking-[-0.025em] text-balance sm:text-4xl">
          {dict.sections.contact}
        </h2>
        <p className="mt-5 max-w-[52ch] text-pretty text-ink-dim">{t.intro}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          {/* Quebra nos separadores (@ e .), nunca no meio de uma palavra. */}
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-11 items-center text-lg text-ink underline decoration-ink-dim/60 underline-offset-[6px] [overflow-wrap:anywhere] hover:decoration-accent-hi sm:text-xl"
          >
            {profile.email}
          </a>
          <CopyEmail email={profile.email} labels={{ copy: t.copy, copied: t.copied }} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button href={profile.links.linkedin} variant="ghost" icon="arrow" {...external}>
            LinkedIn
          </Button>
          <Button href={profile.links.github} variant="ghost" icon="arrow" {...external}>
            GitHub
          </Button>
          {cv && (
            <Button href={cv} variant="ghost" download>
              {t.cv}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
