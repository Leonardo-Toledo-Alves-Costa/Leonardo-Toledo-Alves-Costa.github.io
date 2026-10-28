import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import type { SectionProps } from "./types";

// Estrutura inicial (Task 7); o hero completo vem na Task 8.
export function Hero({ locale }: SectionProps) {
  return (
    <section id="hero" aria-labelledby="hero-title" className="flex min-h-svh items-end pt-32 pb-16">
      <Container>
        <h1 id="hero-title" className="text-[clamp(56px,11vw,132px)] font-bold leading-[0.9] tracking-[-0.045em]">
          {profile.name}
        </h1>
        <p className="mt-6 text-lg text-text-2">{profile.headline[locale]}</p>
      </Container>
    </section>
  );
}
