import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pill } from "@/components/ui/Pill";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SerifStatement } from "@/components/ui/SerifStatement";
import { Orb } from "@/components/motion/Orb";
import { Reveal } from "@/components/motion/Reveal";
import { profile } from "@/content/profile";
import { skills } from "@/content/skills";
import type { SkillLevel } from "@/content/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { localize } from "@/lib/content";
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

export default async function DesignSystemPage({ params }: PageProps<"/[locale]/design-system">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.designSystem;
  // Um exemplo real por nível, tirado do conteúdo do site.
  const examples = LEVELS.map((level) => skills.find((s) => s.level === level)).filter((s) => s !== undefined);

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
              <dd className="mt-2 text-[clamp(40px,4.4vw,64px)] leading-[1.02] font-normal tracking-[-0.04em]">{profile.name}</dd>
            </div>
            <div data-type-level="serif">
              <dt className="font-mono text-xs text-ink-dim">{t.typeSerif}</dt>
              <dd className="mt-2">
                <SerifStatement text={t.statementSample} />
              </dd>
            </div>
            <div data-type-level="section">
              <dt className="font-mono text-xs text-ink-dim">{t.typeSection}</dt>
              <dd className="mt-2 text-5xl leading-tight font-normal tracking-[-0.03em]">{t.typeSectionSample}</dd>
            </div>
            <div data-type-level="body">
              <dt className="font-mono text-xs text-ink-dim">{t.typeBody}</dt>
              <dd className="mt-2 max-w-[60ch] text-base leading-relaxed text-ink-dim">{t.typeBodySample}</dd>
            </div>
            <div data-type-level="label">
              <dt className="font-mono text-xs text-ink-dim">{t.typeLabel}</dt>
              <dd className="mt-2">
                <SectionLabel index="03">{dict.nav.timeline}</SectionLabel>
              </dd>
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

        <Block id="motion" index="08" title={t.motion}>
          <p className="max-w-[60ch] text-sm text-ink-dim">{t.motionNote}</p>
          <Reveal className="mt-8">
            <GlassCard>
              <p className="text-sm">{t.motionReveal}</p>
            </GlassCard>
          </Reveal>
        </Block>
      </Container>
    </main>
  );
}
