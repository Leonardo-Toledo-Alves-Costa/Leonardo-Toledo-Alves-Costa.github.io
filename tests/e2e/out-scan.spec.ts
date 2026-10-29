import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { expect, test } from "@playwright/test";
import { extractText, getDocumentProxy } from "unpdf";
import { findPhones } from "../../src/lib/privacy";

// Varre o que vai para o GitHub Pages: out/ é gerado pelo webServer do Playwright antes dos testes.
const OUT = "out";
const TEXT = new Set([".html", ".js", ".txt", ".xml", ".json", ".css", ".svg", ".webmanifest"]);

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
}

async function textOf(file: string): Promise<string | undefined> {
  const ext = extname(file).toLowerCase();
  if (TEXT.has(ext)) return readFileSync(file, "utf8");
  if (ext === ".pdf") {
    const doc = await getDocumentProxy(new Uint8Array(readFileSync(file)));
    return (await extractText(doc, { mergePages: true })).text;
  }
  return undefined;
}

// Uma varredura basta: o resultado não depende do tamanho da tela.
test.beforeEach(({ isMobile }) => test.skip(isMobile, "varredura do build roda uma vez"));

test("build publicado: sem telefone e sem marcador de conteúdo pendente", async () => {
  const files = walk(OUT);
  const problems: string[] = [];
  let scanned = 0;
  for (const file of files) {
    const text = await textOf(file);
    if (text === undefined) continue;
    scanned++;
    const rel = relative(OUT, file);
    for (const phone of findPhones(text)) problems.push(`${rel}: telefone "${phone}"`);
    if (text.includes("TODO(conteúdo)")) problems.push(`${rel}: TODO(conteúdo)`);
  }
  // Garante que a varredura não passa "no vazio".
  expect(scanned).toBeGreaterThan(10);
  expect(problems).toEqual([]);
});

test("build publicado: sem source maps, .env nem configuração do servidor", () => {
  const forbidden = walk(OUT)
    .map((f) => relative(OUT, f))
    .filter((f) => f.endsWith(".map") || basename(f).startsWith(".env") || basename(f) === "serve.json");
  expect(forbidden).toEqual([]);
});
