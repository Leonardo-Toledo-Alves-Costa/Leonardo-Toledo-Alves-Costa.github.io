import { expect, test } from "vitest";
import { en } from "@/i18n/dictionaries/en";
import { pt } from "@/i18n/dictionaries/pt";
import { getDictionary } from "@/i18n/get-dictionary";

type Tree = { [key: string]: string | Tree };

function leafPaths(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === "string" ? [`${prefix}${k}`] : leafPaths(v, `${prefix}${k}.`),
  );
}

function leafValues(tree: Tree): string[] {
  return Object.values(tree).flatMap((v) => (typeof v === "string" ? [v] : leafValues(v)));
}

test("en tem as mesmas chaves que pt", () => {
  expect(leafPaths(en).sort()).toEqual(leafPaths(pt).sort());
});

test("nenhuma tradução vazia", () => {
  for (const d of [pt, en]) for (const v of leafValues(d)) expect(v.trim()).not.toBe("");
});

test("chaves iniciais existem", () => {
  expect(leafPaths(pt)).toEqual(
    expect.arrayContaining([
      "nav.about", "nav.stack", "nav.timeline", "nav.projects", "nav.learning", "nav.contact",
      "meta.title", "meta.description", "common.skipToContent", "common.switchLanguage",
    ]),
  );
});

test("getDictionary devolve o dicionário do idioma", () => {
  expect(getDictionary("pt")).toBe(pt);
  expect(getDictionary("en")).toBe(en);
});
