import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  /** Posição na página: "02" etc. */
  index: string;
  label: string;
  title: ReactNode;
  /** Legado da linha Silicon (fundo alternado); no Abissal as seções não alternam fundo. Sai na Task 15. */
  tone?: "base" | "raised";
  className?: string;
  children?: ReactNode;
};

/** Casca padrão das seções: âncora, rótulo "01 — Nome" e título h2 ligado por aria-labelledby. */
export function Section({ id, index, label, title, className, children }: SectionProps) {
  // overflow-x-clip: brilhos decorativos que passam da borda não criam rolagem lateral (sem cortar na vertical).
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        // Sem fundo alternado nem borda: no Abissal o ritmo vem do espaço e das camadas.
        "scroll-mt-24 overflow-x-clip py-20 sm:py-28 lg:py-36",
        className,
      )}
    >
      <Container>
        <SectionLabel index={index}>{label}</SectionLabel>
        <h2 id={`${id}-title`} className="mt-4 max-w-[22ch] text-3xl font-normal tracking-[-0.03em] text-balance sm:text-5xl">
          {title}
        </h2>
        {children}
      </Container>
    </section>
  );
}
