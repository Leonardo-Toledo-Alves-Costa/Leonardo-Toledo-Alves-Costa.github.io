import { Parallax } from "@/components/motion/Parallax";
import { Emphasis } from "@/components/ui/Emphasis";
import { profile } from "@/content/profile";
import { localize, splitSpec } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Section } from "./Section";
import type { SectionProps } from "./types";

/** Velocidades desencontradas dos cartões (frente): sobem mais rápido que o texto e entre si. */
const CARD_SPEED = [0.18, 0.32, 0.12, 0.26];

/**
 * Sobre em 3 camadas (spec §5.3, insp. Lunetra): ao fundo o "UNIFEI" gigante vazado, no meio as
 * linhas de grade e a bio (contexto apagado × principal aceso), na frente os cartões de vidro.
 * No celular: 2 camadas (fundo + conteúdo parado), sem linhas, cartões em coluna.
 */
export function About({ locale, dict }: SectionProps) {
  return (
    // Abaixo de 1024px o letreiro fica ancorado no fim da seção e desce com o parallax: recorte vertical
    // para ele não invadir o Destaque.
    <Section id="about" index="01" label={dict.nav.about} title={dict.sections.about} className="relative max-lg:overflow-clip">
      {/* Fundo: texto vazado (contorno na cor das linhas), decorativo. No desktop ocupa o vazio à
          esquerda da bio; no celular fica no respiro do fim da seção, sem cruzar texto. */}
      <Parallax
        speed={-0.25}
        className="pointer-events-none absolute inset-x-0 bottom-2 -z-10 overflow-hidden lg:top-72 lg:bottom-auto"
      >
        <p
          data-backdrop=""
          aria-hidden="true"
          className="px-4 text-[22vw] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_var(--color-line)] sm:px-6 lg:text-[11vw] xl:px-[calc(50%-600px+1.5rem)]"
        >
          {dict.about.backdrop}
        </p>
      </Parallax>

      {/* Meio: linhas finas de grade (só desktop). */}
      {/* Linhas alinhadas à grade do conteúdo: a vertical na borda esquerda do container, a horizontal
          no respiro entre a bio e os cartões (nunca riscando o texto). */}
      <Parallax
        speed={0.1}
        mobile={false}
        className="pointer-events-none absolute inset-y-0 left-6 -z-10 hidden w-px bg-line md:block xl:left-[calc(50%-600px+1.5rem)]"
      />
      <Parallax speed={0.05} mobile={false} className="pointer-events-none absolute inset-x-0 top-[60%] -z-10 hidden h-px bg-line lg:block" />

      <Parallax speed={0.08} mobile={false} className="mt-12 sm:mt-16 lg:ml-auto lg:max-w-[40rem]">
        <p data-bio="" className="text-[clamp(20px,2.2vw,30px)] leading-[1.35] tracking-[-0.015em] text-pretty">
          <Emphasis text={localize(profile.bio, locale)} />
        </p>
      </Parallax>

      <dl className="mt-16 grid gap-4 md:grid-cols-2 md:items-start md:gap-5 lg:grid-cols-4">
        {profile.specs.map((spec, i) => {
          const value = splitSpec(localize(spec.value, locale));
          return (
            <Parallax
              key={spec.label.en}
              speed={CARD_SPEED[i] ?? 0.15}
              mobile={false}
              data-spec=""
              // Cartões desencontrados no desktop (2º e 4º mais baixos): profundidade de camadas. No tablet, 2 colunas.
              className={cn("glass flex flex-col gap-3 rounded-card p-5 sm:p-6", i % 2 === 1 && "lg:mt-12")}
            >
              <dt className="font-mono text-xs tracking-[0.14em] text-ink-dim uppercase">
                <span aria-hidden className="mr-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-ink shadow-[0_0_10px_var(--color-accent)]" />
                {localize(spec.label, locale)}
              </dt>
              <dd className="flex flex-1 flex-col">
                <span data-spec-main="" className="block text-lg leading-snug text-balance text-ink sm:text-xl">
                  {value.main}
                </span>
                {value.sub && (
                  <>
                    {/* Separador para leitores de tela (visualmente, a quebra de linha separa). */}
                    <span className="sr-only"> · </span>
                    <span data-spec-sub="" className="block pt-1 text-sm text-ink-dim">
                      {value.sub}
                    </span>
                  </>
                )}
              </dd>
            </Parallax>
          );
        })}
      </dl>
    </Section>
  );
}
