import { Orb } from "@/components/motion/Orb";
import { Container } from "@/components/ui/Container";
import { SerifStatement } from "@/components/ui/SerifStatement";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Abertura de /projetos (spec §6.2 item 1, insp. Superconscious): o halo do orbe no alto e a frase F4
 * entrando palavra a palavra. O h1 da página vem logo abaixo, discreto.
 */
export function ProjectsIntro({ dict }: { dict: Dictionary }) {
  return (
    <section data-projects-intro="" aria-labelledby="projects-title" className="relative flex min-h-svh flex-col justify-center overflow-x-clip pt-24 pb-16 sm:pt-28">
      <Container className="flex flex-col items-center text-center">
        {/* Halo inteiro na tela, com respiro: nenhum texto sobre o núcleo de luz. */}
        <Orb variant="halo" size="w-[min(40vh,64vw)]" />
        <SerifStatement words text={dict.statements.f4} className="mt-20 max-w-[18ch] sm:mt-24" />
        <h1 id="projects-title" className="mt-6 font-mono text-xs tracking-[0.14em] text-ink-dim uppercase">
          {dict.projectsPage.title}
        </h1>
      </Container>
    </section>
  );
}
