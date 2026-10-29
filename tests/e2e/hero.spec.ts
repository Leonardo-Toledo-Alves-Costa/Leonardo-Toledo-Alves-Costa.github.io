import { expect, test } from "@playwright/test";

for (const locale of ["pt", "en"] as const) {
  test.describe(`hero /${locale}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
    });

    test("h1 com o nome, visível na primeira dobra", async ({ page }) => {
      const h1 = page.locator("#hero h1");
      await expect(h1).toHaveText("Leonardo Tolêdo");
      await expect(h1).toBeInViewport();
    });

    test("selo do prêmio JEWC/ENEJ visível na primeira dobra", async ({ page }) => {
      const badge = page.getByTestId("hero-award");
      await expect(badge).toContainText("JEWC");
      await expect(badge).toContainText("ArborizAI");
      await expect(badge).toBeInViewport();
    });

    test("CTAs com os destinos certos", async ({ page }) => {
      const hero = page.locator("#hero");
      await expect(hero.locator('a[href="https://github.com/Leonardo-Toledo-Alves-Costa"]')).toHaveCount(1);
      await expect(hero.locator('a[href="https://linkedin.com/in/leonardotac"]')).toHaveCount(1);
      await expect(hero.locator('a[href="mailto:ltoledo.alves@gmail.com"]')).toHaveCount(1);
      await expect(hero.locator('a[href="#projects"]')).toHaveCount(1);
    });

    test("sem botão de CV enquanto não houver PDF sem telefone", async ({ page }) => {
      await expect(page.locator("#hero").getByRole("link", { name: /currículo|résumé|cv/i })).toHaveCount(0);
      await expect(page.locator('#hero a[href$=".pdf"]')).toHaveCount(0);
    });

    test("links externos abrem em nova aba com rel seguro", async ({ page }) => {
      for (const a of await page.locator('#hero a[target="_blank"]').all()) {
        await expect(a).toHaveAttribute("rel", /noopener/);
      }
      expect(await page.locator('#hero a[target="_blank"]').count()).toBeGreaterThanOrEqual(2);
    });

    test("headline com a ponte software ⇄ hardware", async ({ page }) => {
      await expect(page.locator("#hero")).toContainText("software ⇄ hardware");
    });
  });
}

test("fundo do hero é decorativo e não captura cliques", async ({ page }) => {
  await page.goto("/pt/");
  const svg = page.locator('#hero svg[data-variant="hero"]');
  await expect(svg).toHaveAttribute("aria-hidden", "true");
  await expect(svg).toHaveCSS("pointer-events", "none");
});

for (const [locale, boot, headline, cta] of [
  ["pt", "inicializando leonardo.sys", "Engenharia de Computação", "Ver projetos"],
  ["en", "initializing leonardo.sys", "Computer Engineering", "See projects"],
] as const) {
  test(`hero traduzido em /${locale}/`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator("#hero [data-boot]")).toContainText(boot);
    await expect(page.locator("#hero")).toContainText(headline);
    await expect(page.locator('#hero a[href="#projects"]')).toHaveText(cta);
  });
}

test("hero diz o status na primeira dobra: UNIFEI e estágio (PT e EN)", async ({ page }) => {
  for (const [locale, re] of [["pt", /UNIFEI.*estágio/], ["en", /UNIFEI.*internship/]] as const) {
    await page.goto(`/${locale}/`);
    const status = page.locator("#hero [data-status]");
    await expect(status).toHaveText(re);
    const box = (await status.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  }
});
