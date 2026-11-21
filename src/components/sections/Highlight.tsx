import { Beam } from "@/components/motion/Beam";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Emphasis } from "@/components/ui/Emphasis";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { localize } from "@/lib/content";
import type { SectionProps } from "./types";

/**
 * Destaque (spec §5.4, insp. Lunetra): um feixe de luz desce do alto até um nó aceso, sob ele o prêmio
 * (contexto apagado × principal aceso), o projeto premiado e o caminho para /projetos.
 */
export function Highlight({ locale, dict }: SectionProps) {
  const awarded = projects.find((p) => p.award);
  return (
    <section id="highlight" aria-labelledby="highlight-title" className="relative scroll-mt-24 overflow-x-clip pb-20 sm:pb-28 lg:pb-36">
      {/* Feixe descendo até o nó de luz onde ele toca o conteúdo. */}
      <Beam className="h-40 sm:h-56 lg:h-72" />

      <Container className="mt-10 flex flex-col items-center text-center sm:mt-12">
        <SectionLabel index="02">{dict.highlight.label}</SectionLabel>
        {/* Trecho apagado em linha própria: aceso / apagado / aceso nos dois idiomas, sem travessão órfão. */}
        <h2
          id="highlight-title"
          className="mt-5 max-w-[20ch] text-[clamp(32px,4.6vw,64px)] leading-[1.05] font-normal tracking-[-0.035em] text-balance [&>[data-emphasis=dim]]:block"
        >
          <Emphasis text={localize(profile.award, locale)} />
        </h2>

        {awarded && (
          <div data-highlight-project="" className="mt-8 flex max-w-[52ch] flex-col items-center gap-4">
            <p className="glass inline-flex items-center gap-2.5 rounded-pill py-2.5 pr-5 pl-4 text-sm">
              <span aria-hidden className="size-1.5 rounded-full bg-ink shadow-[0_0_10px_var(--color-accent)]" />
              <span className="text-ink">{awarded.name}</span>
            </p>
            <p className="text-base leading-relaxed text-pretty text-ink-dim">{localize(awarded.description, locale)}</p>
          </div>
        )}

        <Button href={`/${locale}/projetos/`} icon="arrow" className="mt-10" data-highlight-cta="">
          {dict.highlight.cta}
        </Button>
      </Container>
    </section>
  );
}
