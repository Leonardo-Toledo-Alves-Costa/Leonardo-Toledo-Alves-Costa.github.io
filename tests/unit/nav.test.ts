import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const { Nav } = await import("@/components/layout/Nav");

const items = [
  { id: "about", label: "sobre" },
  { id: "timeline", label: "trajetória" },
  { id: "projects", label: "projetos" },
  { id: "contact", label: "contato" },
];
const labels = { nav: "Navegação", menu: "Abrir menu", close: "Fechar menu", switchLanguage: "View in English" };

/** Vitest roda em node (sem DOM): extrai os links do HTML estático da Nav. */
function render(route: "home" | "projects") {
  const html = renderToStaticMarkup(createElement(Nav, { locale: "pt", route, items, labels }));
  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs = "", text = ""]) => ({
    href: /href="([^"]*)"/.exec(attrs)?.[1],
    current: /aria-current="([^"]*)"/.exec(attrs)?.[1],
    testid: /data-testid="([^"]*)"/.exec(attrs)?.[1],
    text: text.replace(/<[^>]+>/g, ""),
  }));
  return { anchors };
}

test("em /projetos: nome volta para a home e âncoras apontam para a home com #", () => {
  const { anchors } = render("projects");
  expect(anchors.find((a) => a.text === "Leonardo Tolêdo")?.href).toBe("/pt/");
  for (const id of ["about", "timeline", "contact"]) {
    const a = anchors.find((x) => x.href === `/pt/#${id}`);
    expect(a, id).toBeDefined();
    expect(a?.current, id).toBeUndefined();
  }
});

test("em /projetos: item Projetos marcado como página atual", () => {
  const projetos = render("projects").anchors.filter((a) => a.href === "/pt/projetos/");
  expect(projetos.length).toBeGreaterThan(0);
  for (const a of projetos) expect(a.current).toBe("page");
});

test("em /projetos: troca de idioma leva para /en/projetos/", () => {
  expect(render("projects").anchors.find((a) => a.testid === "locale-switch")?.href).toBe("/en/projetos/");
});

test("na home: âncoras locais e Projetos sem aria-current", () => {
  const { anchors } = render("home");
  expect(anchors.find((a) => a.text === "Leonardo Tolêdo")?.href).toBe("#hero");
  expect(anchors.some((a) => a.href === "#about")).toBe(true);
  expect(anchors.find((a) => a.href === "/pt/projetos/")?.current).toBeUndefined();
  expect(anchors.find((a) => a.testid === "locale-switch")?.href).toBe("/en/");
});
