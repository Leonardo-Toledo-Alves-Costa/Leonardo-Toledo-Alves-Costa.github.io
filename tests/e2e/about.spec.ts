import { expect, test } from "@playwright/test";

// Redesign Abissal — Sobre em camadas (spec §5.3, insp. Lunetra).

const SPECS = {
  pt: [["Formação", "Eng. de Computação"], ["Período", "4º período"], ["Pesquisa", "Iniciação Científica"], ["Liderança", "Diretor de Projetos"]],
  en: [["Education", "B.Sc. Computer Engineering"], ["Stage", "4th semester"], ["Research", "Undergraduate research"], ["Leadership", "Director of Projects"]],
} as const;

for (const locale of ["pt", "en"] as const) {
  test.describe(`sobre /${locale}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/#about`);
    });

    test("bio do perfil com contexto apagado e o principal aceso", async ({ page }) => {
      const bio = page.locator("#about [data-bio]");
      await expect(bio).toContainText(locale === "pt" ? "Engenharia de Computação na UNIFEI" : "Computer Engineering undergraduate at UNIFEI");
      expect(await bio.locator('[data-emphasis="dim"]').count()).toBeGreaterThan(0);
      expect(await bio.locator('[data-emphasis="lit"]').count()).toBeGreaterThan(0);
    });

    test("4 cartões de vidro com rótulo e valor reais", async ({ page }) => {
      const cards = page.locator("#about [data-spec]");
      await expect(cards).toHaveCount(4);
      for (const [i, [label, value]] of SPECS[locale].entries()) {
        await expect(cards.nth(i)).toContainText(label);
        await expect(cards.nth(i)).toContainText(value);
      }
      expect(await cards.first().evaluate((el) => getComputedStyle(el).backdropFilter)).toMatch(/blur/);
    });
  });
}

test("estrutura válida de lista de definições (dl > div > dt/dd)", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page.locator("#about dl > div > dt")).toHaveCount(4);
  await expect(page.locator("#about dl > div > dd")).toHaveCount(4);
});

test("valor do cartão separa principal e complemento", async ({ page }) => {
  await page.goto("/pt/");
  const first = page.locator("#about [data-spec]").first();
  await expect(first.locator("[data-spec-main]")).toHaveText("Eng. de Computação");
  await expect(first.locator("[data-spec-sub]")).toHaveText("UNIFEI");
});

test("desktop: 4 cartões lado a lado; celular: em coluna", async ({ page, isMobile }) => {
  await page.goto("/pt/#about");
  const lefts = await page.locator("#about [data-spec]").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().left)));
  expect(new Set(lefts).size).toBe(isMobile ? 1 : 4);
});

test("texto vazado de fundo (UNIFEI) é decorativo", async ({ page }) => {
  await page.goto("/pt/");
  const backdrop = page.locator("#about [data-backdrop]");
  await expect(backdrop).toHaveText("UNIFEI");
  await expect(backdrop).toHaveAttribute("aria-hidden", "true");
  expect(await backdrop.evaluate((el) => getComputedStyle(el).color)).toBe("rgba(0, 0, 0, 0)");
});

test("desktop: as camadas andam em velocidades diferentes na rolagem", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular são só 2 camadas; a diferença é medida no desktop");
  await page.goto("/pt/");
  await page.locator("#about").scrollIntoViewIfNeeded();
  const offsets = async () =>
    page.locator("#about [data-parallax]").evaluateAll((els) => els.map((e) => new DOMMatrix(getComputedStyle(e).transform).m42));
  const a = await offsets();
  await page.mouse.wheel(0, 400);
  await expect.poll(async () => (await offsets()).some((v, i) => Math.abs(v - (a[i] ?? 0)) > 2)).toBe(true);
  const b = await offsets();
  const deltas = new Set(b.map((v, i) => Math.round(v - (a[i] ?? 0))));
  expect(deltas.size).toBeGreaterThanOrEqual(3);
});

test.describe("reduzir movimento", () => {
  test.use({ reducedMotion: "reduce" });
  test("camadas paradas (sem transform)", async ({ page }) => {
    await page.goto("/pt/");
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 300);
    for (const el of await page.locator("#about [data-parallax]").all()) {
      expect(await el.evaluate((e) => getComputedStyle(e).transform)).toBe("none");
    }
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("bio e cartões visíveis", async ({ page }) => {
    await page.goto("/pt/");
    await expect(page.locator("#about [data-bio]")).toBeVisible();
    for (const card of await page.locator("#about [data-spec]").all()) await expect(card).toBeVisible();
  });
});

test("celular: só o fundo anda; bio e cartões ficam parados (máx. 2 camadas)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "regra do celular");
  await page.goto("/pt/");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 400);
  const backdropLayer = page.locator("#about [data-parallax]:has([data-backdrop])");
  await expect.poll(() => backdropLayer.evaluate((e) => getComputedStyle(e).transform)).not.toBe("none");
  expect(await page.locator("#about [data-parallax]:has([data-bio])").evaluate((e) => getComputedStyle(e).transform)).toBe("none");
  for (const card of await page.locator("#about [data-spec]").all()) {
    expect(await card.evaluate((e) => getComputedStyle(e).transform)).toBe("none");
  }
});
