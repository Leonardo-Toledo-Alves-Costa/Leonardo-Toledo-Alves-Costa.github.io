import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Emphasis } from "@/components/ui/Emphasis";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/config";
import { localize } from "@/lib/content";
import { cn } from "@/lib/cn";
import type { SectionProps } from "./types";

/** Formação e Liderança vêm das specs do perfil; o status curto fecha a telemetria (spec §5.1). */
function telemetry(locale: Locale, statusLabel: string) {
  const pick = (pt: string) => profile.specs.find((s) => s.label.pt === pt);
  const items = [pick("Formação"), pick("Liderança")]
    .filter((s) => s !== undefined)
    .map((s) => ({ label: localize(s.label, locale), value: localize(s.value, locale) }));
  return [...items, { label: statusLabel, value: localize(profile.statusShort, locale) }];
}

/**
 * Posição de cada rótulo em volta do orbe no desktop (insp. Obelisk): acima, à esquerda e à direita,
 * sempre fora da esfera (--orb é o diâmetro). No celular viram uma lista acima do título.
 */
const AROUND = [
  "xl:left-1/2 xl:-translate-x-1/2 xl:top-[calc(42%-var(--orb)/2-5.5rem)] xl:text-center",
  "xl:right-[calc(50%+var(--orb)/2+2.75rem)] xl:top-[42%] xl:-translate-y-1/2 xl:text-right",
  "xl:left-[calc(50%+var(--orb)/2+2.75rem)] xl:top-[42%] xl:-translate-y-1/2",
];
// Tudo termina em ≤ 2,5 s (delay + duração).
const DELAY = ["[animation-delay:900ms]", "[animation-delay:1050ms]", "[animation-delay:1200ms]"];

/** Abertura: orbe ao centro, telemetria em volta, nome + título embaixo à esquerda, status + ação à direita. */
export function Hero({ locale, dict }: SectionProps) {
  const t = dict.hero;
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      // O orbe e a variável --orb vêm do OpeningStage (camada fixa que atravessa hero + expansão).
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-24 pb-10 lg:min-h-[max(100svh,680px)] lg:pb-16"
    >

      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="lg:max-w-[52%]">
          <ul data-telemetry="" aria-label={t.telemetryLabel} className="mb-8 grid gap-2 xl:mb-0">
            {telemetry(locale, t.statusLabel).map((item, i) => (
              <li
                key={item.label}
                className={cn("animate-rise motion-reduce:animate-none xl:absolute xl:whitespace-nowrap", AROUND[i], DELAY[i])}
              >
                <dl className="flex flex-wrap items-baseline gap-x-2 text-sm xl:block">
                  <dt className="text-ink-dim">{item.label}</dt>
                  <dd className="text-ink xl:mt-0.5">{item.value}</dd>
                </dl>
              </li>
            ))}
          </ul>

          <h1 id="hero-title" className="text-base font-medium tracking-[-0.01em] text-ink">
            {profile.name}
          </h1>
          <p
            data-hero-title=""
            className="mt-3 animate-settle text-[clamp(40px,4.4vw,64px)] leading-[1.02] font-normal tracking-[-0.035em] [animation-delay:400ms] motion-reduce:animate-none [&>[data-emphasis=dim]]:block"
          >
            <Emphasis text={localize(profile.headline, locale)} />
          </p>
        </div>

        <div data-hero-cta="" className="max-w-sm animate-rise [animation-delay:1500ms] motion-reduce:animate-none lg:text-right">
          <p data-status="" className="text-base leading-relaxed text-balance text-ink-dim">
            {localize(profile.status, locale)}
          </p>
          <Button href={`/${locale}/projetos/`} icon="arrow" className="mt-5">
            {t.ctaProjects}
          </Button>
        </div>
      </Container>

      <p
        aria-hidden
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 animate-rise font-mono text-xs tracking-[0.14em] text-ink-dim uppercase [animation-delay:1700ms] motion-reduce:animate-none lg:block"
      >
        {t.scrollHint} ↓
      </p>
    </section>
  );
}
