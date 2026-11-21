import { LightOnScroll } from "@/components/motion/LightOnScroll";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SerifStatement } from "@/components/ui/SerifStatement";
import { timeline } from "@/content/timeline";
import { formatPeriod } from "@/lib/content";
import type { SectionProps } from "./types";

/**
 * Trajetória (spec §5.5, insp. Lunetra: linhas finas com nós de luz). Abre com a frase F2 em serifa;
 * depois, rótulo e título à esquerda (fixos no desktop) e a linha com os marcos na ordem do conteúdo.
 * Cada nó acende quando o marco passa de 60% da tela.
 */
export function Timeline({ locale, dict }: SectionProps) {
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="relative scroll-mt-24 overflow-x-clip py-20 sm:py-28 lg:py-36">
      <Container>
        <SerifStatement text={dict.statements.f2} className="mx-auto max-w-[20ch] text-center" />

        <div className="mt-20 grid gap-12 sm:mt-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionLabel index="03">{dict.nav.timeline}</SectionLabel>
            <h2 id="timeline-title" className="mt-4 max-w-[16ch] text-3xl font-normal tracking-[-0.03em] text-balance sm:text-5xl">
              {dict.sections.timeline}
            </h2>
          </div>

          <LightOnScroll>
            <ol className="relative">
              {timeline.map((entry) => (
                <li
                  key={entry.id}
                  data-entry={entry.id}
                  data-lit="true"
                  className={
                    "group relative pb-12 pl-9 last:pb-0 sm:pb-14 sm:pl-11 " +
                    // Trilha fina só até o próximo nó (não passa do último).
                    "not-last:before:absolute not-last:before:top-[18px] not-last:before:-bottom-[7px] not-last:before:left-[5px] not-last:before:w-px not-last:before:bg-line not-last:before:content-['']"
                  }
                >
                  {/* Nó: anel apagado; a luz é uma camada por cima que aparece (opacidade/escala). */}
                  <span data-node="" aria-hidden="true" className="absolute top-[7px] left-0 size-[11px] rounded-full border border-ink-dim/50 bg-bg-abyss">
                    <span
                      data-node-glow=""
                      className="absolute -inset-px scale-50 rounded-full bg-ink opacity-0 shadow-[0_0_12px_2px_var(--color-accent),0_0_32px_6px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition-[opacity,transform] duration-500 ease-abissal group-data-[lit=true]:scale-100 group-data-[lit=true]:opacity-100 motion-reduce:transition-none"
                    />
                  </span>
                  <h3 className="text-xl leading-snug font-normal tracking-[-0.015em] text-balance text-ink sm:text-2xl">{entry.role[locale]}</h3>
                  <p data-meta="" className="mt-1.5 text-sm text-ink-dim">
                    {entry.org} · {formatPeriod(entry, locale)}
                  </p>
                  {/* No celular, 2 linhas (o texto inteiro segue no DOM para leitores de tela). */}
                  <p data-summary="" className="mt-3 max-w-[60ch] leading-relaxed text-pretty text-ink-dim max-md:line-clamp-2">
                    {entry.summary[locale]}
                  </p>
                </li>
              ))}
            </ol>
          </LightOnScroll>
        </div>
      </Container>
    </section>
  );
}
