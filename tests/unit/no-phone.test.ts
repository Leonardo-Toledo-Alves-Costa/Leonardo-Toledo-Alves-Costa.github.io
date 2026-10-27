import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { extractText, getDocumentProxy } from "unpdf";
import { expect, test } from "vitest";
import { PHONE, findPhones } from "@/lib/privacy";

// Os exemplos (fictícios) de telefone ficam SÓ neste arquivo; a varredura ignora este arquivo (e nada mais).
const SELF = "tests/unit/no-phone.test.ts";
const TEXT = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".md", ".svg", ".txt", ".xml", ".html", ".css", ".yml", ".yaml"]);
// Lockfile: gerado, sem dado pessoal, e cheio de hashes que geram falso positivo.
const SKIP = new Set([SELF, "package-lock.json"]);

const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" });
const files = [
  ...git("ls-files", "-z").split("\0"),
  ...git("ls-files", "-z", "--others", "--exclude-standard", "--", "src", "public", "tests").split("\0"),
].filter((f) => f && !SKIP.has(f) && existsSync(f));

async function pdfText(file: string): Promise<string> {
  const doc = await getDocumentProxy(new Uint8Array(readFileSync(file)));
  const { text } = await extractText(doc, { mergePages: true });
  return text;
}

// Números fictícios: nenhum dígito de telefone real entra no repositório.
test.each(["(11) 9 8765-4321", "+55 11 98765-4321", "11987654321", "(11) 98765-4321", "11 9.8765.4321", "11 - 98765 - 4321"])("detecta %s", (s) => {
  expect(PHONE.test(s)).toBe(true);
});

test.each(["2026-10-27", "1440x900", "v16.4.3", "390×844", "123119876543210", "sha-11987654321abc"])("não acusa %s", (s) => {
  expect(PHONE.test(s)).toBe(false);
});

test("findPhones devolve todas as ocorrências", () => {
  expect(findPhones("a (11) 98765-4321 b +55 21 91234-5678")).toHaveLength(2);
  expect(findPhones("nada aqui")).toEqual([]);
});

test("nenhum telefone em arquivos versionados", () => {
  const hits = files
    .filter((f) => TEXT.has(extname(f)))
    .flatMap((f) => findPhones(readFileSync(f, "utf8")).map((m) => `${f}: ${m}`));
  expect(hits).toEqual([]);
});

test("nenhum telefone em PDFs de public/", async () => {
  const pdfs = files.filter((f) => f.startsWith("public/") && extname(f) === ".pdf");
  for (const f of pdfs) {
    expect(findPhones(await pdfText(f)), f).toEqual([]);
  }
});

// Prova de que o detector funciona em PDF de verdade: os currículos-fonte (locais, fora do git) TÊM telefone.
const CV_DIR = "docs/00-contexto-zero/curriculo";
test.skipIf(!existsSync(CV_DIR))("detector acha o telefone nos currículos-fonte locais", async () => {
  const cvs = readdirSync(CV_DIR).filter((f) => extname(f) === ".pdf");
  expect(cvs.length).toBeGreaterThan(0);
  for (const f of cvs) expect(findPhones(await pdfText(join(CV_DIR, f))).length, f).toBeGreaterThan(0);
});
