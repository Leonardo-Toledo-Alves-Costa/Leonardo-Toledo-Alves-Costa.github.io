import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Terminal } from "@/components/ui/Terminal";
import { learning } from "@/content/learning";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { SkillLevel } from "@/content/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localize } from "@/lib/content";
import { ChipToggle } from "./ChipToggle";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const TOKENS = [
  ["bg", "#000000"],
  ["surface-1", "#0A0B0A"],
  ["surface-2", "#1D1D1F"],
  ["glass", "rgb(255 255 255 / 8%)"],
  ["line", "rgb(255 255 255 / 8%)"],
  ["text-2", "#86868B"],
  ["text", "#F5F5F7"],
  ["signal", "#7CFF6B"],
] as const;

const LEVELS: SkillLevel[] = ["learning", "used", "proficient"];

function Block({ id, index, title, children }: { id: string; index: string; title: string; children: ReactNode }) {
  return (
    <section data-testid={`ds-${id}`} aria-labelledby={`ds-${id}-title`} className="border-t border-line py-12">
      <SectionLabel as="h2" id={`ds-${id}-title`} index={index}>
        {title}
      </SectionLabel>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Trilhas de circuito decorativas atrás do vidro (fiel ao protótipo aprovado). */
function Traces() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 800 280" preserveAspectRatio="none">
      <g fill="none" stroke="var(--color-signal)" strokeWidth="1.2" strokeDasharray="6 10" vectorEffect="non-scaling-stroke">
        <path d="M0 230 H180 L220 190 H420 L460 150 H800" />
        <path d="M0 70 H120 L160 110 H520 L560 70 H800" />
        <path d="M300 0 V90 L340 130 V280" />
      </g>
    </svg>
  );
}

export default async function DesignSystemPage({ params }: PageProps<"/[locale]/design-system">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.designSystem;
  // Um exemplo real por nível, tirado do conteúdo do site.
  const examples = LEVELS.map((level) => skills.find((s) => s.level === level)).filter((s) => s !== undefined);
  const spec = profile.specs[0];
  const study = learning[0];

  return (
    <main className="pb-24">
      <Container>
        <header className="py-16">
          <h1 className="text-4xl font-bold tracking-[-0.045em] sm:text-6xl">{t.title}</h1>
          <p className="mt-4 max-w-[60ch] text-text-2">{t.intro}</p>
        </header>

        <Block id="colors" index="01" title={t.colors}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {TOKENS.map(([name, value]) => (
              <li key={name}>
                <div
                  className="h-16 rounded-xl border border-line"
                  style={{
                    background: `var(--color-${name})`,
                    boxShadow: name === "signal" ? "0 0 24px rgb(124 255 107 / 0.4)" : undefined,
                  }}
                />
                <p className="mt-2 font-mono text-xs text-text">{name}</p>
                <p className="font-mono text-xs text-text-2">{value}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[60ch] text-sm text-text-2">{t.colorsNote}</p>
        </Block>

        <Block id="type" index="02" title={t.type}>
          <dl className="grid gap-8">
            <div data-type-level="display">
              <dt className="font-mono text-xs text-text-2">{t.typeDisplay}</dt>
              <dd className="mt-2 text-[clamp(56px,11vw,132px)] font-bold leading-[0.9] tracking-[-0.045em]">{profile.name}</dd>
            </div>
            <div data-type-level="section">
              <dt className="font-mono text-xs text-text-2">{t.typeSection}</dt>
              <dd className="mt-2 text-[40px] font-bold leading-tight tracking-[-0.03em]">{t.typeSectionSample}</dd>
            </div>
            <div data-type-level="body">
              <dt className="font-mono text-xs text-text-2">{t.typeBody}</dt>
              <dd className="mt-2 max-w-[60ch] text-[17px] leading-relaxed text-text-2">{t.typeBodySample}</dd>
            </div>
            <div data-type-level="label">
              <dt className="font-mono text-xs text-text-2">{t.typeLabel}</dt>
              <dd className="mt-2">
                <SectionLabel index="04">{dict.nav.timeline}</SectionLabel>
              </dd>
            </div>
            <div data-type-level="code">
              <dt className="font-mono text-xs text-text-2">{t.typeCode}</dt>
              <dd className="mt-2 font-mono text-sm text-signal">$ make ponte --hw --sw</dd>
            </div>
          </dl>
        </Block>

        <Block id="buttons" index="03" title={t.buttons}>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="#ds-buttons-title">{t.primary}</Button>
            <Button variant="glass" href="#ds-spotlight-title">
              {t.secondary}
            </Button>
            <Button variant="signal">&gt; {t.signal}</Button>
          </div>
        </Block>

        <Block id="chips" index="04" title={t.chips}>
          <div className="flex flex-wrap gap-2">
            {examples.map((skill) => (
              <Chip key={skill.id} level={skill.level}>
                {localize(skill.name, locale)} · {dict.levels[skill.level]}
              </Chip>
            ))}
          </div>
          <p className="mt-6 text-sm text-text-2">{t.chipsInteractive}</p>
          <div className="mt-3">
            <ChipToggle items={examples.map((s) => ({ id: s.id, label: localize(s.name, locale), level: s.level }))} />
          </div>
        </Block>

        <Block id="glass" index="05" title={t.glass}>
          <div className="relative min-h-[300px] overflow-hidden rounded-panel border border-line bg-[radial-gradient(circle_at_20%_30%,rgb(124_255_107/0.3),transparent_35%),radial-gradient(circle_at_80%_70%,rgb(160_170_255/0.22),transparent_40%)] p-4 sm:p-8">
            {/* Grade numa camada própria: o background-size dela não pode repetir os brilhos. */}
            <div aria-hidden className="pcb-grid absolute inset-0" />
            <Traces />
            <div className="relative flex flex-col items-center gap-6">
              <GlassPanel as="nav" aria-label={t.glass} className="w-fit max-w-full rounded-pill px-5 py-2.5">
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-2">
                  <li className="font-mono font-medium text-signal">LT_</li>
                  {(["about", "stack", "timeline", "projects"] as const).map((k) => (
                    <li key={k}>{dict.nav[k]}</li>
                  ))}
                </ul>
              </GlassPanel>
              <div className="grid w-full gap-4 sm:grid-cols-2">
                {spec && (
                  <GlassPanel className="p-5">
                    <p className="silkscreen text-text/70">{spec.label[locale]}</p>
                    <p className="mt-1 text-xl font-semibold">{spec.value[locale]}</p>
                  </GlassPanel>
                )}
                {study && (
                  <GlassPanel className="p-5">
                    <p className="silkscreen text-text/70">{dict.nav.learning}</p>
                    <p className="mt-1 text-xl font-semibold">{study.topic[locale]}</p>
                  </GlassPanel>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-[60ch] text-sm text-text-2">{t.glassBody}</p>
        </Block>

        <Block id="spotlight" index="06" title={t.spotlight}>
          <p className="mb-6 max-w-[60ch] text-sm text-text-2">{t.spotlightBody}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <SpotlightCard key={project.id}>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="mt-2 text-sm text-text-2">{project.tagline[locale]}</p>
              </SpotlightCard>
            ))}
          </div>
        </Block>

        <Block id="terminal" index="07" title={t.terminal}>
          <Terminal className="max-w-md">connect --to leonardo</Terminal>
        </Block>
      </Container>
    </main>
  );
}
