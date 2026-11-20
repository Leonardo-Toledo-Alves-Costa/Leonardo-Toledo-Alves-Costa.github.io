import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

/** JS inicial (gzip) da home no v0.4.0, medido na Task 1 (docs/03-memoria/reviews/baseline-redesign.md). */
const BASELINE_JS_KB = 219.3;
/** Spec §10: no máximo +25 KB gzip sobre a linha de base; o shader vai num chunk carregado depois. */
const BUDGET_KB = BASELINE_JS_KB + 25;

/** O script é ESM (import.meta) e o Playwright transpila os testes para CJS: roda como processo. */
function jsBudgetKb(html: string): number {
  return Number(execFileSync(process.execPath, ["scripts/js-budget.mjs", html], { encoding: "utf8" }).trim());
}

test("JS inicial da home dentro do orçamento", async ({ isMobile }) => {
  test.skip(isMobile, "mede arquivos do build, não depende da tela");
  for (const locale of ["pt", "en"]) {
    const kb = jsBudgetKb(`out/${locale}/index.html`);
    expect(kb, locale).toBeGreaterThan(0);
    expect(kb, locale).toBeLessThanOrEqual(BUDGET_KB);
  }
});

test("o código do shader fica fora do JS inicial (chunk carregado depois)", async ({ isMobile }) => {
  test.skip(isMobile, "mede arquivos do build, não depende da tela");
  // /design-system já monta o <Orb> com shader; a home ganha o orbe na Task 9.
  const html = readFileSync("out/pt/design-system/index.html", "utf8");
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1] ?? "");
  expect(scripts.length).toBeGreaterThan(0);
  for (const src of scripts) expect(readFileSync(`out${src.split("?")[0]}`, "utf8"), src).not.toContain("uExpand");
});
