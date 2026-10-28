import { Reveal } from "@/components/motion/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { profile } from "@/content/profile";
import { splitSpec } from "@/lib/content";
import { Section } from "./Section";
import type { SectionProps } from "./types";

/** Bio curta + "ficha técnica": transforma o currículo enxuto em especificações escaneáveis. */
export function About({ locale, dict }: SectionProps) {
  return (
    <Section tone="raised" id="about" index="02" label={dict.nav.about} title={dict.sections.about}>
      <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-pretty text-text/90 sm:mt-8 sm:text-xl sm:leading-relaxed">
        {profile.bio[locale]}
      </p>
      <Reveal className="relative mt-10 sm:mt-14">
        {/* Duas camadas (grade e brilho no mesmo elemento repetiriam o brilho em ladrilhos), ambas
            com máscara radial: a placa some suave nas bordas, sem quina cortada. */}
        <div
          aria-hidden
          className="absolute -inset-x-4 -inset-y-10 bg-[radial-gradient(ellipse_at_50%_50%,color-mix(in_srgb,var(--color-signal)_10%,transparent),transparent_65%)] [mask-image:radial-gradient(ellipse_at_50%_50%,#000_30%,transparent_70%)] sm:-inset-x-8"
        />
        <div
          aria-hidden
          className="pcb-grid absolute -inset-x-4 -inset-y-10 [mask-image:radial-gradient(ellipse_at_50%_50%,#000_30%,transparent_72%)] sm:-inset-x-8"
        />
        <dl className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {profile.specs.map((spec) => {
            const value = splitSpec(spec.value[locale]);
            return (
              // Rótulo e valor principal alinhados no topo em todos os cards da fileira.
              <GlassPanel key={spec.label.en} data-spec="" className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
                <dt className="silkscreen text-text/70">{spec.label[locale]}</dt>
                <dd className="flex flex-1 flex-col">
                  <span data-spec-main="" className="block text-lg font-semibold leading-snug text-balance sm:text-xl">
                    {value.main}
                  </span>
                  {value.sub && (
                    <>
                      {/* Separador para leitores de tela (visualmente, a quebra de linha separa). */}
                      <span className="sr-only"> · </span>
                      <span data-spec-sub="" className="mt-auto block pt-1 text-sm text-text-2">
                        {value.sub}
                      </span>
                    </>
                  )}
                </dd>
              </GlassPanel>
            );
          })}
        </dl>
      </Reveal>
    </Section>
  );
}
