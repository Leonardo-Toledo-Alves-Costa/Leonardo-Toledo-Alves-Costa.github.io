// Mede o JavaScript inicial de uma página exportada: soma o gzip dos <script src> referenciados no HTML.
// Uso: node scripts/js-budget.mjs [out/pt/index.html]
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** KB (gzip) de todos os scripts externos carregados pelo HTML, resolvidos a partir de out/. */
export function jsBudgetKb(htmlPath) {
  const html = readFileSync(htmlPath, "utf8");
  const outDir = join(ROOT, "out");
  const srcs = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]))];
  let bytes = 0;
  for (const src of srcs) {
    if (/^https?:/.test(src)) continue;
    bytes += gzipSync(readFileSync(join(outDir, src.split("?")[0]))).length;
  }
  return Math.round((bytes / 1024) * 10) / 10;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2] ?? join(ROOT, "out", "pt", "index.html");
  // String: um número no console.log sai com cores ANSI quando FORCE_COLOR está ligado (Playwright).
  process.stdout.write(`${jsBudgetKb(target)}\n`);
}
