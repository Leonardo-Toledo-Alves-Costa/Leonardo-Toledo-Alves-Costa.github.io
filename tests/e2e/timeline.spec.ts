import { expect, test } from "@playwright/test";
import { timeline } from "../../src/content/timeline";
import { formatPeriod, shortHash } from "../../src/lib/content";

test.describe("trajetória /pt/", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt/#timeline");
  });

  test("entradas em ordem decrescente de início", async ({ page }) => {
    const ids = await page.locator("#timeline [data-entry]").evaluateAll((els) => els.map((e) => e.getAttribute("data-entry")));
    expect(ids).toEqual([...timeline].sort((a, b) => b.start.localeCompare(a.start)).map((t) => t.id));
    expect(ids[0]).toBe("ic-unifei");
    expect(ids.at(-1)).toBe("ambev");
  });

  test("só a entrada mais recente tem HEAD", async ({ page }) => {
    await expect(page.locator("#timeline [data-head]")).toHaveCount(1);
    await expect(page.locator('#timeline [data-entry="ic-unifei"] [data-head]')).toHaveCount(1);
  });

  test("destaque (prêmio): LED verde, selo e menção ao JEWC; título na cor de texto", async ({ page }) => {
    const director = page.locator('#timeline [data-entry="asimov-director"]');
    await expect(director).toHaveAttribute("data-highlight", "true");
    await expect(director).toContainText("JEWC");
    await expect(director.locator("[data-dot]")).toHaveCSS("background-color", "rgb(124, 255, 107)");
    await expect(director.locator("[data-award]")).toBeVisible();
    await expect(director.locator("h3")).toHaveCSS("color", "rgb(245, 245, 247)");
  });

  test("é uma lista ordenada e cada commit tem seu Reveal (sequência)", async ({ page }) => {
    await expect(page.locator("#timeline ol > li[data-entry]")).toHaveCount(timeline.length);
    await expect(page.locator("#timeline ol > li[data-entry] [data-reveal]")).toHaveCount(timeline.length);
  });

  test("trilha do grafo termina dentro do último ponto", async ({ page }) => {
    await expect(page.locator("#timeline ol")).toHaveCSS("border-left-width", "0px");
    // Medidas no mesmo frame (a rolagem suave até a âncora muda o viewport entre chamadas).
    const { railEnd, dotTop, dotBottom, lastHasRail } = await page.evaluate(() => {
      const items = [...document.querySelectorAll<HTMLLIElement>("#timeline li[data-entry]")];
      const penult = items[items.length - 2]!;
      const last = items[items.length - 1]!;
      const before = getComputedStyle(penult, "::before");
      const top = penult.getBoundingClientRect().top + parseFloat(before.top);
      const dot = last.querySelector("[data-dot]")!.getBoundingClientRect();
      return {
        railEnd: top + parseFloat(before.height),
        dotTop: dot.top,
        dotBottom: dot.bottom,
        lastHasRail: !["none", "normal"].includes(getComputedStyle(last, "::before").content),
      };
    });
    expect(lastHasRail).toBe(false);
    expect(railEnd).toBeGreaterThanOrEqual(dotTop);
    expect(railEnd).toBeLessThanOrEqual(dotBottom);
  });

  test("tokens do commit não colam no texto (hash, HEAD, período)", async ({ page }) => {
    const text = await page.locator('#timeline [data-entry="ic-unifei"] [data-meta]').textContent();
    expect(text).toMatch(/^[0-9a-f]{7} \(HEAD\) abr 2026/);
  });

  test("organização não fica separada do ' · ' na quebra de linha", async ({ page }) => {
    for (const org of await page.locator("#timeline [data-org]").all()) {
      await expect(org).toHaveCSS("white-space", "nowrap");
    }
  });
});

for (const locale of ["pt", "en"] as const) {
  test(`todas as entradas com hash, período, cargo e organização exatos (/${locale}/)`, async ({ page }) => {
    await page.goto(`/${locale}/#timeline`);
    for (const entry of timeline) {
      const el = page.locator(`#timeline [data-entry="${entry.id}"]`);
      await expect(el.locator("[data-hash]")).toHaveText(shortHash(entry.id));
      await expect(el).toContainText(formatPeriod(entry, locale));
      await expect(el).toContainText(entry.role[locale]);
      await expect(el).toContainText(entry.org);
    }
  });
}
