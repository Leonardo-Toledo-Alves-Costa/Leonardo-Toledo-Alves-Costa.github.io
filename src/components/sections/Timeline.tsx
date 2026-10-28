import { Reveal } from "@/components/motion/Reveal";
import { timeline } from "@/content/timeline";
import { cn } from "@/lib/cn";
import { formatPeriod, shortHash } from "@/lib/content";
import { Section } from "./Section";
import type { SectionProps } from "./types";

/** Trajetória como git log: formação e experiência numa linha só, o mais recente no topo (HEAD). */
export function Timeline({ locale, dict }: SectionProps) {
  const entries = [...timeline].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <Section tone="raised" id="timeline" index="04" label={dict.nav.timeline} title={dict.sections.timeline}>
      <p className="mt-6 max-w-[60ch] text-lg text-text-2">{dict.timeline.intro}</p>
      <ol className="relative mt-12 ml-1">
        {entries.map((entry, i) => {
          const isHead = i === 0;
          return (
            <li
              key={entry.id}
              data-entry={entry.id}
              data-highlight={entry.highlight ? "true" : "false"}
              className={cn(
                "relative pb-10 pl-7 last:pb-0 sm:pl-9",
                // Segmento do grafo só até o próximo commit: a trilha termina no último ponto.
                "not-last:before:absolute not-last:before:top-3 not-last:before:-bottom-3 not-last:before:left-0 not-last:before:w-px not-last:before:bg-white/16 not-last:before:content-['']",
              )}
            >
              {/* LED do commit: verde no destaque, aceso fraco no HEAD, apagado no histórico. */}
              <span
                aria-hidden
                data-dot=""
                className={cn(
                  "absolute top-1.5 -left-[4px] z-10 size-[9px] rounded-full border",
                  entry.highlight
                    ? "border-signal bg-signal shadow-[0_0_10px_var(--color-signal)]"
                    : isHead
                      ? "border-led-dim bg-led-dim"
                      : "border-text-2 bg-surface-2",
                )}
              />
              {/* Sequência real: cada commit entra no seu tempo. */}
              <Reveal delay={i * 0.06}>
                <p data-meta="" className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs sm:text-sm">
                  <span data-hash="" className="rounded bg-glass px-1.5 py-0.5 text-led-dim">
                    {shortHash(entry.id)}
                  </span>{" "}
                  {isHead && (
                    <>
                      <span data-head="" className="rounded-pill border border-signal/35 bg-signal/10 px-2 py-0.5 text-signal">
                        (HEAD)
                      </span>{" "}
                    </>
                  )}
                  <span className="text-text-2">{formatPeriod(entry, locale)}</span>
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] sm:text-2xl">
                  {entry.role[locale]}
                  <span data-org="" className="font-normal whitespace-nowrap text-text-2">
                    {" "}
                    · {entry.org}
                  </span>
                </h3>
                {entry.highlight && (
                  <p data-award="" className="silkscreen mt-2 text-signal">
                    {dict.hero.awardLabel} · JEWC/ENEJ
                  </p>
                )}
                <p className="mt-2 max-w-[65ch] leading-relaxed text-pretty text-text/80">{entry.summary[locale]}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
