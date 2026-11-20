import { expect, test } from "vitest";
import { localizedPath } from "@/lib/locale-path";

test("home troca de idioma", () => {
  expect(localizedPath("/pt/", "en")).toBe("/en/");
  expect(localizedPath("/en/", "pt")).toBe("/pt/");
});

test("/projetos preserva a rota no outro idioma", () => {
  expect(localizedPath("/pt/projetos/", "en")).toBe("/en/projetos/");
  expect(localizedPath("/en/projetos", "pt")).toBe("/pt/projetos/");
});

test("raiz ou caminho sem idioma vai para a home do destino", () => {
  expect(localizedPath("/", "en")).toBe("/en/");
  expect(localizedPath("", "pt")).toBe("/pt/");
});

test("sempre termina com barra (o Pages serve as pastas assim)", () => {
  expect(localizedPath("/pt/design-system", "en")).toBe("/en/design-system/");
});
