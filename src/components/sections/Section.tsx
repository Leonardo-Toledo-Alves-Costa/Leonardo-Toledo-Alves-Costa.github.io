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
  /** "raised" = fundo #1D1D1F, alternando com o preto para dar ritmo (como a Apple). */
  tone?: "base" | "raised";
  className?: string;
  children?: ReactNode;
};

/** Casca padrão das seções: âncora, rótulo de serigrafia e título h2 ligado por aria-labelledby. */
export function Section({ id, index, label, title, tone = "base", className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-24 border-t border-line py-16 sm:py-24 lg:py-32", tone === "raised" && "bg-surface-2", className)}
    >
      <Container>
        <SectionLabel index={index}>{label}</SectionLabel>
        <h2 id={`${id}-title`} className="mt-4 max-w-[22ch] text-3xl font-bold tracking-[-0.03em] text-balance sm:text-5xl">
          {title}
        </h2>
        {children}
      </Container>
    </section>
  );
}
