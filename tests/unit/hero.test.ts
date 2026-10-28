import { expect, test } from "vitest";
import { heroCtas, splitHeadline } from "@/lib/hero";

test("sem CV: 'Ver projetos' é o único CTA primário e não há link de CV", () => {
  const ctas = heroCtas({ cvHref: undefined });
  expect(ctas.filter((c) => c.variant === "primary").map((c) => c.kind)).toEqual(["projects"]);
  expect(ctas.some((c) => c.kind === "cv")).toBe(false);
});

test("com CV: 'Baixar currículo' vira o primário e 'Ver projetos' passa a vidro", () => {
  const ctas = heroCtas({ cvHref: "/cv/leonardo-toledo-cv-pt.pdf" });
  expect(ctas[0]).toMatchObject({ kind: "cv", variant: "primary", href: "/cv/leonardo-toledo-cv-pt.pdf" });
  expect(ctas.find((c) => c.kind === "projects")?.variant).toBe("glass");
  expect(ctas.filter((c) => c.variant === "primary")).toHaveLength(1);
});

test("ordem estável: CV?, projetos, LinkedIn, GitHub, e-mail", () => {
  expect(heroCtas({ cvHref: undefined }).map((c) => c.kind)).toEqual(["projects", "linkedin", "github", "email"]);
});

test("splitHeadline separa curso e ponte pelo último ' · '", () => {
  expect(splitHeadline("Engenharia de Computação · software ⇄ hardware")).toEqual({
    lead: "Engenharia de Computação",
    focus: "software ⇄ hardware",
  });
  expect(splitHeadline("sem separador")).toEqual({ lead: "", focus: "sem separador" });
});
