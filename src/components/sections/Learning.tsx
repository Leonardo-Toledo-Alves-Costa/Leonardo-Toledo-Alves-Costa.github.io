import { Orb } from "@/components/motion/Orb";
import { GlassCard } from "@/components/ui/GlassCard";
import { learning } from "@/content/learning";
import { localize } from "@/lib/content";
import { Section } from "./Section";
import type { SectionProps } from "./types";

/**
 * Agora estudando (spec §5.6): bloco curto de vidro com o brilho de um mini-orbe (só CSS, sem shader)
 * e o estudo atual — tópico e porquê. Some se não houver estudo.
 */
export function Learning({ locale, dict }: SectionProps) {
  if (learning.length === 0) return null;

  return (
    <Section id="learning" index="04" label={dict.nav.learning} title={dict.sections.learning}>
      <ul className="mt-12 grid max-w-3xl gap-4">
        {learning.map((item, i) => (
          <GlassCard
            as="li"
            key={item.id}
            data-learning={item.id}
            className="flex flex-col gap-8 p-6 sm:flex-row sm:items-center sm:gap-10 sm:p-8"
          >
            {/* Um mini-orbe só (no primeiro estudo); o halo pede respiro antes do texto. */}
            {i === 0 && <Orb variant="mini" size="w-14 sm:w-16" className="mx-3 mt-3 shrink-0 sm:mx-4 sm:mt-0" />}
            <div>
              <h3 className="text-xl font-normal tracking-[-0.015em] text-ink sm:text-2xl">{localize(item.topic, locale)}</h3>
              <p className="mt-2 max-w-[60ch] leading-relaxed text-pretty text-ink-dim">{localize(item.why, locale)}</p>
            </div>
          </GlassCard>
        ))}
      </ul>
    </Section>
  );
}
