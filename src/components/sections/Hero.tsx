import { BootSequence } from "@/components/motion/BootSequence";
import { ChromeText } from "@/components/motion/ChromeText";
import { CircuitTraces } from "@/components/motion/CircuitTraces";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { heroCtas, splitHeadline, type HeroCta } from "@/lib/hero";
import type { SectionProps } from "./types";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/**
 * Primeira dobra: em ~5s, quem é (nome), o que faz (headline), por que se destaca (prêmio) e como seguir (CTAs).
 * Assinatura visual: nome gigante com reflexo cromado sobre uma placa com trilhas vivas.
 */
export function Hero({ locale, dict }: SectionProps) {
  const t = dict.hero;
  const awarded = projects.find((p) => p.award);
  const headline = splitHeadline(profile.headline[locale]);

  const cta = (c: HeroCta) => {
    switch (c.kind) {
      case "cv":
        return (
          <Button key={c.kind} variant={c.variant} href={c.href} download>
            {t.ctaCv}
          </Button>
        );
      case "projects":
        return (
          <Button key={c.kind} variant={c.variant} href={c.href}>
            {t.ctaProjects}
          </Button>
        );
      case "linkedin":
        return (
          <Button key={c.kind} variant={c.variant} href={profile.links.linkedin} {...external}>
            LinkedIn
          </Button>
        );
      case "github":
        return (
          <Button key={c.kind} variant={c.variant} href={profile.links.github} {...external}>
            GitHub
          </Button>
        );
      case "email":
        return (
          <Button key={c.kind} variant={c.variant} href={`mailto:${profile.email}`}>
            &gt; {t.ctaEmail}
          </Button>
        );
    }
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-end overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-20"
    >
      {/* Fundo: grade de PCB, brilho ambiente e trilhas com pulsos (tudo decorativo). */}
      <div aria-hidden className="pcb-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_65%_45%,#000_15%,transparent_70%)]" />
      <div
        aria-hidden
        className="absolute -top-40 right-[-10%] -z-10 size-[min(720px,90vw)] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-signal)_16%,transparent),transparent_62%)] blur-[10px]"
      />
      <CircuitTraces
        variant="hero"
        className="absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_at_75%_40%,#000_25%,transparent_78%)]"
      />

      <Container>
        <BootSequence lines={[t.boot1, t.boot2, t.boot3]} status={t.bootStatus} />

        {/* Entrelinha maior enquanto o nome quebra em 2 linhas: folga para o circunflexo de "Tolêdo". */}
        <ChromeText
          as="h1"
          id="hero-title"
          className="mt-6 text-[clamp(56px,11vw,132px)] font-bold leading-[1.04] tracking-[-0.045em] lg:leading-[0.92]"
        >
          {profile.name}
        </ChromeText>

        <p className="mt-6 max-w-[40ch] text-lg text-text-2 sm:text-xl">
          {headline.lead && <>{headline.lead} · </>}
          <span className="whitespace-nowrap font-medium text-text">{headline.focus}</span>
        </p>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">{heroCtas({ cvHref: profile.cv?.[locale] }).map(cta)}</div>

          <GlassPanel data-testid="hero-award" className="max-w-md px-5 py-4">
            <p className="silkscreen text-signal">{t.awardLabel}</p>
            <p className="mt-1.5 text-base font-semibold leading-snug text-balance">{profile.award[locale]}</p>
            {awarded && (
              <p className="mt-1 text-sm text-pretty text-text-2">
                {awarded.name} · {awarded.tagline[locale]}
              </p>
            )}
          </GlassPanel>
        </div>
      </Container>
    </section>
  );
}
