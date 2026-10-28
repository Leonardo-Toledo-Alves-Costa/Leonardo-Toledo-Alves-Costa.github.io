import { Reveal } from "@/components/motion/Reveal";
import { learning } from "@/content/learning";
import { formatProgressBar } from "@/lib/content";
import { Section } from "./Section";
import type { SectionProps } from "./types";

/** "Agora compilando…": o que está em estudo, como um build em andamento. Some se não houver estudo. */
export function Learning({ locale, dict }: SectionProps) {
  if (learning.length === 0) return null;
  const t = dict.learning;

  return (
    <Section tone="raised" id="learning" index="06" label={dict.nav.learning} title={dict.sections.learning}>
      <p className="mt-6 max-w-[60ch] text-lg text-text-2">{t.intro}</p>
      {/* Mesma medida do terminal de contato: status perto do tópico. */}
      <Reveal className="mt-10 max-w-3xl">
        <ul className="grid gap-4">
          {learning.map((item) => {
            const bar = item.progress === undefined ? undefined : formatProgressBar(item.progress);
            return (
              <li key={item.id} data-learning={item.id} className="rounded-panel border border-white/12 bg-surface-1 p-5 font-mono sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="text-xl font-semibold tracking-[-0.01em] text-text sm:text-2xl">
                    <span aria-hidden className="mr-2 text-text-2">
                      $
                    </span>
                    {item.topic[locale]}
                  </h3>
                  {bar === undefined ? (
                    <span className="text-sm text-signal">
                      <span
                        aria-hidden
                        data-pulse-dot=""
                        className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-signal align-middle shadow-[0_0_8px_var(--color-signal)] motion-reduce:animate-none"
                      />
                      {t.compiling}
                    </span>
                  ) : (
                    <span
                      role="progressbar"
                      aria-label={`${t.progress}: ${item.topic[locale]}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={bar.percent}
                      className="text-sm text-text-2"
                    >
                      [<span className="text-signal">{"#".repeat(bar.filled)}</span>
                      {"-".repeat(bar.empty)}] {bar.percent}%
                    </span>
                  )}
                </div>
                <p className="mt-3 max-w-[65ch] font-sans leading-relaxed text-pretty text-text/80">{item.why[locale]}</p>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
