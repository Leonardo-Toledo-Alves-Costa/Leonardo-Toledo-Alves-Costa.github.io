export type HeroCtaKind = "cv" | "projects" | "linkedin" | "github" | "email";
export type HeroCta = { kind: HeroCtaKind; variant: "primary" | "glass" | "signal"; href?: string };

/**
 * CTAs do hero, com um único primário: o currículo quando existir (PDF sem telefone),
 * senão "Ver projetos". Os hrefs de LinkedIn/GitHub/e-mail vêm do perfil no componente.
 */
export function heroCtas({ cvHref }: { cvHref: string | undefined }): HeroCta[] {
  const ctas: HeroCta[] = [];
  if (cvHref) ctas.push({ kind: "cv", variant: "primary", href: cvHref });
  ctas.push(
    { kind: "projects", variant: cvHref ? "glass" : "primary", href: "#projects" },
    { kind: "linkedin", variant: "glass" },
    { kind: "github", variant: "glass" },
    { kind: "email", variant: "signal" },
  );
  return ctas;
}

/** "Engenharia de Computação · software ⇄ hardware" → curso + ponte (o foco). */
export function splitHeadline(headline: string): { lead: string; focus: string } {
  const at = headline.lastIndexOf(" · ");
  if (at < 0) return { lead: "", focus: headline };
  return { lead: headline.slice(0, at), focus: headline.slice(at + 3) };
}
