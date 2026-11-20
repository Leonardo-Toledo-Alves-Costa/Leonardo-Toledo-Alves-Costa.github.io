import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill } from "@/components/ui/Pill";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SerifStatement } from "@/components/ui/SerifStatement";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Terminal } from "@/components/ui/Terminal";
import { BootSequence } from "@/components/motion/BootSequence";
import { ChromeText } from "@/components/motion/ChromeText";
import { CircuitTraces } from "@/components/motion/CircuitTraces";
import { Orb } from "@/components/motion/Orb";
import { Reveal } from "@/components/motion/Reveal";
import { learning } from "@/content/learning";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { SkillLevel } from "@/content/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localize } from "@/lib/content";
import { ChipToggle } from "./ChipToggle";
import { PillToggle } from "./PillToggle";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const TOKENS = [
  ["bg-abyss", "#02050C"],
  ["bg-deep", "#06122A"],
  ["bg-glow", "#0E2A5A"],
  ["glass", "rgb(14 30 60 / 35%)"],
  ["line", "rgb(255 255 255 / 14%)"],
  ["ink-dim", "#8897B3"],
  ["ink", "#EEF3FA"],
  ["accent", "#2F7BFF"],
  ["accent-hi", "#9CC4FF"],
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
      <g fill="none" stroke="var(--color-accent-hi)" strokeWidth="1.2" strokeDasharray="6 10" vectorEffect="non-scaling-stroke">
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
          <p className="mt-4 max-w-[60ch] text-ink-dim">{t.intro}</p>
        </header>

        <Block id="colors" index="01" title={t.colors}>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {TOKENS.map(([name, value]) => (
              <li key={name}>
                <div
                  className="h-16 rounded-xl border border-line"
                  style={{
                    background: `var(--color-${name})`,
                    boxShadow: name === "accent" ? "0 0 24px rgb(47 123 255 / 0.5)" : undefined,
                  }}
                />
                <p className="mt-2 font-mono text-xs text-ink">{name}</p>
                <p className="font-mono text-xs text-ink-dim">{value}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[60ch] text-sm text-ink-dim">{t.colorsNote}</p>
        </Block>

        <Block id="type" index="02" title={t.type}>
          <dl className="grid gap-8">
            <div data-type-level="display">
              <dt className="font-mono text-xs text-ink-dim">{t.typeDisplay}</dt>
              <dd className="mt-2 text-[clamp(56px,11vw,132px)] font-bold leading-[0.9] tracking-[-0.045em]">{profile.name}</dd>
            </div>
            <div data-type-level="serif">
              <dt className="font-mono text-xs text-ink-dim">{t.typeSerif}</dt>
              <dd className="mt-2">
                <SerifStatement text={t.statementSample} />
              </dd>
            </div>
            <div data-type-level="section">
              <dt className="font-mono text-xs text-ink-dim">{t.typeSection}</dt>
              <dd className="mt-2 text-[40px] font-bold leading-tight tracking-[-0.03em]">{t.typeSectionSample}</dd>
            </div>
            <div data-type-level="body">
              <dt className="font-mono text-xs text-ink-dim">{t.typeBody}</dt>
              <dd className="mt-2 max-w-[60ch] text-[17px] leading-relaxed text-ink-dim">{t.typeBodySample}</dd>
            </div>
            <div data-type-level="label">
              <dt className="font-mono text-xs text-ink-dim">{t.typeLabel}</dt>
              <dd className="mt-2">
                <SectionLabel index="04">{dict.nav.timeline}</SectionLabel>
              </dd>
            </div>
            <div data-type-level="code">
              <dt className="font-mono text-xs text-ink-dim">{t.typeCode}</dt>
              <dd className="mt-2 font-mono text-sm text-accent-hi">$ make ponte --hw --sw</dd>
            </div>
          </dl>
        </Block>

        <Block id="buttons" index="03" title={t.buttons}>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="#ds-buttons-title" icon="arrow">
              {t.secondary}
            </Button>
            <Button variant="ghost" href="#ds-pills-title">
              {t.ghost}
            </Button>
            <Button variant="ghost" icon="arrow" href="#ds-cards-title">
              {t.ghostArrow}
            </Button>
          </div>
        </Block>

        <Block id="pills" index="04" title={t.pills}>
          <div className="flex flex-wrap gap-2">
            {examples.map((skill) => (
              <Pill key={skill.id} level={skill.level} levelLabel={dict.levels[skill.level]}>
                {localize(skill.name, locale)} <span aria-hidden className="text-ink-dim">· {dict.levels[skill.level]}</span>
              </Pill>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-dim">{t.pillsInteractive}</p>
          <div className="mt-3">
            <PillToggle
              items={examples.map((s) => ({ id: s.id, label: localize(s.name, locale), level: s.level, levelLabel: dict.levels[s.level] }))}
            />
          </div>
        </Block>

        <Block id="cards" index="05" title={t.cards}>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.specs.slice(0, 2).map((s, i) => (
              <GlassCard key={localize(s.label, locale)}>
                <SectionLabel index={String(i + 1).padStart(2, "0")}>{localize(s.label, locale)}</SectionLabel>
                <p className="mt-3 text-lg text-ink">{localize(s.value, locale)}</p>
              </GlassCard>
            ))}
          </div>
        </Block>

        <Block id="statement" index="06" title={t.statement}>
          <SerifStatement text={t.statementSample} />
        </Block>

        <Block id="orb" index="07" title={t.orb}>
          {/* Respiro de sobra: o halo vaza 45% do tamanho para cada lado e não pode ser cortado pelo painel. */}
          <div className="grid place-items-center gap-y-20 overflow-hidden rounded-panel border border-line px-8 py-20 sm:grid-cols-3">
            {(
              [
                ["mini", "w-16"],
                ["hero", "w-36 sm:w-40"],
                ["halo", "w-40 sm:w-44"],
              ] as const
            ).map(([variant, size]) => (
              <figure key={variant} className="grid h-72 grid-rows-[1fr_auto] place-items-center">
                <Orb variant={variant} size={size} />
                <figcaption className="font-mono text-xs text-ink-dim">{variant}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-dim">{t.orbNote}</p>
        </Block>

        <Block id="chips" index="08" title={t.chips}>
          <div className="flex flex-wrap gap-2">
            {examples.map((skill) => (
              <Chip key={skill.id} level={skill.level}>
                {localize(skill.name, locale)} · {dict.levels[skill.level]}
              </Chip>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-dim">{t.chipsInteractive}</p>
          <div className="mt-3">
            <ChipToggle items={examples.map((s) => ({ id: s.id, label: localize(s.name, locale), level: s.level }))} />
          </div>
        </Block>

        <Block id="glass" index="09" title={t.glass}>
          <div className="relative min-h-[300px] overflow-hidden rounded-panel border border-line bg-[radial-gradient(circle_at_20%_30%,rgb(156_196_255/0.3),transparent_35%),radial-gradient(circle_at_80%_70%,rgb(160_170_255/0.22),transparent_40%)] p-4 sm:p-8">
            {/* Grade numa camada própria: o background-size dela não pode repetir os brilhos. */}
            <div aria-hidden className="pcb-grid absolute inset-0" />
            <Traces />
            <div className="relative flex flex-col items-center gap-6">
              <GlassPanel as="nav" aria-label={t.glass} className="w-fit max-w-full rounded-pill px-5 py-2.5">
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-dim">
                  <li className="font-mono font-medium text-accent-hi">LT_</li>
                  {(["about", "stack", "timeline", "projects"] as const).map((k) => (
                    <li key={k}>{dict.nav[k]}</li>
                  ))}
                </ul>
              </GlassPanel>
              <div className="grid w-full gap-4 sm:grid-cols-2">
                {spec && (
                  <GlassPanel className="p-5">
                    <p className="silkscreen text-ink/70">{spec.label[locale]}</p>
                    <p className="mt-1 text-xl font-semibold">{spec.value[locale]}</p>
                  </GlassPanel>
                )}
                {study && (
                  <GlassPanel className="p-5">
                    <p className="silkscreen text-ink/70">{dict.nav.learning}</p>
                    <p className="mt-1 text-xl font-semibold">{study.topic[locale]}</p>
                  </GlassPanel>
                )}
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-[60ch] text-sm text-ink-dim">{t.glassBody}</p>
        </Block>

        <Block id="spotlight" index="10" title={t.spotlight}>
          <p className="mb-6 max-w-[60ch] text-sm text-ink-dim">{t.spotlightBody}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <SpotlightCard key={project.id}>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="mt-2 text-sm text-ink-dim">{project.tagline[locale]}</p>
              </SpotlightCard>
            ))}
          </div>
        </Block>

        <Block id="terminal" index="11" title={t.terminal}>
          <Terminal className="max-w-md">connect --to leonardo</Terminal>
        </Block>

        <Block id="motion" index="12" title={t.motion}>
          <p className="max-w-[60ch] text-sm text-ink-dim">{t.motionNote}</p>
          <div className="relative mt-8 overflow-hidden rounded-panel border border-line bg-bg-abyss p-6 sm:p-10">
            <div aria-hidden className="pcb-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_40%,#000_20%,transparent_70%)]" />
            {/* Brilho ambiente verde no alto à direita (protótipo aprovado). */}
            <div aria-hidden className="absolute -top-1/2 left-2/5 size-[520px] rounded-full bg-[radial-gradient(circle,rgb(156_196_255/0.18),transparent_60%)] blur-[10px]" />
            <CircuitTraces variant="hero" className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_75%_50%,#000_30%,transparent_80%)]" />
            <div className="relative">
              <BootSequence lines={[dict.hero.boot1, dict.hero.boot2, dict.hero.boot3]} status={dict.hero.bootStatus} />
              <ChromeText as="p" className="mt-4 text-[clamp(44px,8vw,96px)] font-bold leading-[0.98] tracking-[-0.045em] sm:leading-[0.9]">
                {profile.name}
              </ChromeText>
            </div>
          </div>
          <div className="mt-8 aspect-[5/2] w-full rounded-panel border border-line bg-bg-deep p-4">
            <CircuitTraces variant="board" activeIds={["software"]} />
          </div>
          <p className="mt-3 text-sm text-ink-dim">{t.motionBoard}</p>
          <Reveal className="mt-8">
            <GlassPanel className="p-5">
              <p className="text-sm">{t.motionReveal}</p>
            </GlassPanel>
          </Reveal>
        </Block>
      </Container>
    </main>
  );
}
