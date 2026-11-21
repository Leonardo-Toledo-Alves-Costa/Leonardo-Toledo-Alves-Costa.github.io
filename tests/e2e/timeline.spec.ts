import { expect, test, type Page } from "@playwright/test";
import { timeline } from "../../src/content/timeline";
import { en } from "../../src/i18n/dictionaries/en";
import { pt } from "../../src/i18n/dictionaries/pt";
import { formatPeriod } from "../../src/lib/content";
import { splitEmphasis } from "../../src/lib/emphasis";

// Redesign Abissal — Trajetória com nós de luz (spec §5.5, insp. Lunetra: linhas finas com nós).

/** Rola até o marco ficar com o topo na fração `f` da altura da tela. */
async function placeEntry(page: Page, id: string, f: number) {
  await page.evaluate(
    ([sel, frac]) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`sem ${sel}`);
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * Number(frac), behavior: "instant" });
    },
    [`#timeline [data-entry="${id}"]`, String(f)] as const,
  );
}

const lit = (page: Page, id: string) => page.locator(`#timeline [data-entry="${id}"]`).getAttribute("data-lit");
const first = timeline[0]!.id;
const last = timeline.at(-1)!.id;

for (const locale of ["pt", "en"] as const) {
  test(`/${locale}/: 5 marcos na ordem do conteúdo, com cargo, organização e período`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const ids = await page.locator("#timeline ol > li[data-entry]").evaluateAll((els) => els.map((e) => e.getAttribute("data-entry")));
    expect(ids).toEqual(timeline.map((t) => t.id));
    for (const entry of timeline) {
      const el = page.locator(`#timeline [data-entry="${entry.id}"]`);
      await expect(el.locator("h3")).toHaveText(entry.role[locale]);
      await expect(el.locator("[data-meta]")).toHaveText(`${entry.org} · ${formatPeriod(entry, locale)}`);
      // Texto completo no DOM (o corte a 2 linhas no celular é só visual).
      await expect(el.locator("[data-summary]")).toHaveText(entry.summary[locale]);
    }
  });

  test(`/${locale}/: abre com a frase F2 em serifa`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    const statement = page.locator("#timeline [data-statement]");
    const f2 = (locale === "pt" ? pt : en).statements.f2;
    await expect(statement).toHaveText(splitEmphasis(f2).map((s) => s.text).join(""));
    expect(await statement.evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/Instrument Serif/);
  });
}

test("cargo aceso; organização e período apagados", async ({ page }) => {
  await page.goto("/pt/");
  const entry = page.locator(`#timeline [data-entry="${first}"]`);
  await expect(entry.locator("h3")).toHaveCSS("color", "rgb(238, 243, 250)");
  await expect(entry.locator("[data-meta]")).toHaveCSS("color", "rgb(136, 151, 179)");
  // Dois tons só (spec §4.2): o resumo também é contexto.
  await expect(entry.locator("[data-summary]")).toHaveCSS("color", "rgb(136, 151, 179)");
});

test("trilha de 1px liga os nós e termina dentro do último", async ({ page }) => {
  await page.goto("/pt/");
  const { railEnd, dotTop, dotBottom, lastHasRail, width } = await page.evaluate(() => {
    const items = [...document.querySelectorAll<HTMLLIElement>("#timeline li[data-entry]")];
    const penult = items.at(-2)!;
    const last = items.at(-1)!;
    const before = getComputedStyle(penult, "::before");
    const top = penult.getBoundingClientRect().top + parseFloat(before.top);
    const dot = last.querySelector("[data-node]")!.getBoundingClientRect();
    return {
      railEnd: top + parseFloat(before.height),
      dotTop: dot.top,
      dotBottom: dot.bottom,
      lastHasRail: !["none", "normal"].includes(getComputedStyle(last, "::before").content),
      width: before.width,
    };
  });
  expect(width).toBe("1px");
  expect(lastHasRail).toBe(false);
  expect(railEnd).toBeGreaterThanOrEqual(dotTop);
  expect(railEnd).toBeLessThanOrEqual(dotBottom);
});

test("nó acende quando o marco passa de 60% da tela, e apaga ao voltar", async ({ page }) => {
  await page.goto("/pt/");
  await placeEntry(page, first, 0.8);
  await expect.poll(() => lit(page, first)).toBe("false");
  await placeEntry(page, first, 0.4);
  await expect.poll(() => lit(page, first)).toBe("true");
  // Os de baixo continuam apagados até a vez deles.
  expect(await lit(page, last)).toBe("false");
  await placeEntry(page, first, 0.9);
  await expect.poll(() => lit(page, first)).toBe("false");
});

test("nó aceso fica visível (camada de luz com opacidade 1)", async ({ page }) => {
  await page.goto("/pt/");
  await placeEntry(page, first, 0.3);
  const glow = page.locator(`#timeline [data-entry="${first}"] [data-node-glow]`);
  await expect.poll(() => glow.evaluate((e) => Number(getComputedStyle(e).opacity))).toBe(1);
});

test("celular corta o resumo em 2 linhas; desktop mostra inteiro", async ({ page, isMobile }) => {
  await page.goto("/pt/");
  const clamp = await page.locator("#timeline [data-summary]").first().evaluate((e) => getComputedStyle(e).webkitLineClamp);
  expect(clamp).toBe(isMobile ? "2" : "none");
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("todos os nós acesos e marcos visíveis", async ({ page }) => {
    await page.goto("/pt/");
    for (const entry of timeline) {
      expect(await lit(page, entry.id)).toBe("true");
      await expect(page.locator(`#timeline [data-entry="${entry.id}"] h3`)).toBeVisible();
    }
  });
});

test.describe("reduzir movimento", () => {
  test.use({ reducedMotion: "reduce" });
  test("todos os nós acesos, sem esperar a rolagem", async ({ page }) => {
    await page.goto("/pt/");
    for (const entry of timeline) expect(await lit(page, entry.id)).toBe("true");
  });
});
