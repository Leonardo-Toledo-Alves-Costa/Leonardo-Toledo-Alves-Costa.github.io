import { expect, test } from "@playwright/test";

// Redesign Abissal — Destaque: feixe de luz, prêmio e caminho para /projetos (spec §5.4).

for (const locale of ["pt", "en"] as const) {
  test.describe(`destaque /${locale}/`, () => {
    test("prêmio com o ArborizAI, logo depois do Sobre", async ({ page }) => {
      await page.goto(`/${locale}/`);
      const section = page.locator("#highlight");
      await expect(section).toBeVisible();
      await expect(section.locator("h2")).toContainText("JEWC");
      await expect(section).toContainText("ArborizAI");
      await expect(section.locator("[data-section-label]")).toHaveText(locale === "pt" ? "02 — destaque" : "02 — highlight");
      // Ordem da home (spec §5): Sobre → Destaque.
      const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
      expect(ids.indexOf("highlight")).toBe(ids.indexOf("about") + 1);
    });

    test("prêmio com contexto apagado e o principal aceso", async ({ page }) => {
      await page.goto(`/${locale}/`);
      const title = page.locator("#highlight h2");
      expect(await title.locator('[data-emphasis="dim"]').count()).toBeGreaterThan(0);
      expect(await title.locator('[data-emphasis="lit"]').count()).toBeGreaterThan(0);
    });

    test("botão leva aos projetos no mesmo idioma", async ({ page }) => {
      await page.goto(`/${locale}/`);
      const cta = page.locator("#highlight [data-highlight-cta]");
      await expect(cta).toHaveAttribute("href", `/${locale}/projetos/`);
      await expect(cta).toHaveText(locale === "pt" ? "Ver projetos e stack" : "See projects and stack");
      await expect(cta).toHaveAttribute("data-variant", "primary");
    });
  });
}

test("feixe de luz vertical decorativo (gradiente com a cor de destaque)", async ({ page }) => {
  await page.goto("/pt/");
  const beam = page.locator("#highlight [data-beam]");
  await expect(beam).toHaveAttribute("aria-hidden", "true");
  const style = await beam.evaluate((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { image: s.backgroundImage, w: r.width, h: r.height };
  });
  expect(style.image).toMatch(/linear-gradient/);
  expect(style.h).toBeGreaterThan(style.w * 20);
});

test("o nó só acende quando o feixe chega até ele", async ({ page }) => {
  await page.goto("/pt/");
  const node = page.locator("#highlight [data-beam-node]");
  await expect(node).toHaveAttribute("aria-hidden", "true");
  // Seção mal entrou na tela: feixe curto, nó apagado.
  await page.evaluate(() => {
    const el = document.querySelector("#highlight");
    if (!el) throw new Error("sem destaque");
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight + 80, behavior: "instant" });
  });
  await expect.poll(() => node.evaluate((e) => Number(getComputedStyle(e).opacity))).toBeLessThan(0.5);
  // Feixe inteiro: nó aceso.
  await page.locator("#highlight h2").scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const el = document.querySelector("#highlight");
    if (!el) throw new Error("sem destaque");
    scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: "instant" });
  });
  await expect.poll(() => node.evaluate((e) => Number(getComputedStyle(e).opacity))).toBe(1);
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("prêmio, projeto, botão e feixe visíveis", async ({ page }) => {
    await page.goto("/pt/");
    await expect(page.locator("#highlight h2")).toBeVisible();
    await expect(page.locator("#highlight [data-highlight-project]")).toBeVisible();
    await expect(page.locator("#highlight [data-highlight-cta]")).toBeVisible();
    await expect(page.locator("#highlight [data-beam]")).toBeVisible();
    expect(await page.locator("#highlight [data-beam-node]").evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
  });
});

test.describe("reduzir movimento", () => {
  test.use({ reducedMotion: "reduce" });
  test("feixe inteiro e parado", async ({ page }) => {
    await page.goto("/pt/");
    await page.locator("#highlight").scrollIntoViewIfNeeded();
    expect(await page.locator("#highlight [data-beam]").evaluate((e) => getComputedStyle(e).transform)).toBe("none");
    expect(await page.locator("#highlight [data-beam-node]").evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
  });
});
