import type { ButtonVariant } from "@/components/ui/Button";

export type HeroCtaKind = "cv" | "projects" | "linkedin" | "github" | "email";
export type HeroCta = { kind: HeroCtaKind; variant: ButtonVariant; href?: string };

/**
 * CTAs do hero, com um único primário: o currículo quando existir (PDF sem telefone),
 * senão "Ver projetos". Os hrefs de LinkedIn/GitHub/e-mail vêm do perfil no componente.
 */
export function heroCtas({ cvHref }: { cvHref: string | undefined }): HeroCta[] {
  const ctas: HeroCta[] = [];
  if (cvHref) ctas.push({ kind: "cv", variant: "primary", href: cvHref });
  ctas.push(
    { kind: "projects", variant: cvHref ? "ghost" : "primary", href: "#projects" },
    { kind: "linkedin", variant: "ghost" },
    { kind: "github", variant: "ghost" },
    { kind: "email", variant: "ghost" },
  );
  return ctas;
}

/** "Engenharia de Computação · software ⇄ hardware" → curso + ponte (o foco). */
export function splitHeadline(headline: string): { lead: string; focus: string } {
  const at = headline.lastIndexOf(" · ");
  if (at < 0) return { lead: "", focus: headline };
  return { lead: headline.slice(0, at), focus: headline.slice(at + 3) };
}
