import { expect, test } from "@playwright/test";

const SECTIONS = ["colors", "type", "buttons", "pills", "cards", "statement", "orb", "motion"];

test.describe("página /design-system", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt/design-system/");
  });

  test("todas as seções do design system renderizam", async ({ page }) => {
    for (const s of SECTIONS) await expect(page.getByTestId(`ds-${s}`)).toBeVisible();
  });

  test("amostra dos grandes momentos em Instrument Serif, em pé", async ({ page }) => {
    const serif = page.locator('[data-type-level="serif"] [data-statement]');
    await expect(serif).toBeVisible();
    await expect(serif).toHaveCSS("font-family", /Instrument Serif/);
    await expect(serif).toHaveCSS("font-style", "normal");
  });

  test("tokens aplicados no body", async ({ page }) => {
    const body = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return { bg: s.backgroundColor, color: s.color, font: s.fontFamily };
    });
    expect(body.bg).toBe("rgb(2, 5, 12)");
    expect(body.color).toBe("rgb(238, 243, 250)");
    expect(body.font).toMatch(/Geist/);
  });

  test("foco visível por teclado no primeiro botão", async ({ page }) => {
    const first = page.getByTestId("ds-buttons").getByRole("link").or(page.getByTestId("ds-buttons").getByRole("button")).first();
    await first.focus();
    const ring = await first.evaluate((el) => {
      const s = getComputedStyle(el);
      return { outline: s.outlineStyle, shadow: s.boxShadow };
    });
    expect(ring.outline !== "none" || ring.shadow !== "none").toBe(true);
  });

  test("página não é indexada", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("sem rolagem horizontal", async ({ page }) => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("screenshots para revisão (PT e EN)", async ({ page }, info) => {
    await page.screenshot({ path: `test-results/ds-pt-${info.project.name}.png`, fullPage: true });
    await page.goto("/en/design-system/");
    await page.screenshot({ path: `test-results/ds-en-${info.project.name}.png`, fullPage: true });
  });
});

test("versão em inglês também existe", async ({ page }) => {
  const res = await page.goto("/en/design-system/");
  expect(res?.status()).toBe(200);
  await expect(page.getByTestId("ds-colors")).toBeVisible();
});

test.describe("comportamento dos componentes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt/design-system/");
  });

  test("foco por Tab: anel de 2px sólido no primeiro controle", async ({ page }) => {
    await page.keyboard.press("Tab");
    const ring = await page.evaluate(() => {
      const s = getComputedStyle(document.activeElement as Element);
      return { style: s.outlineStyle, width: s.outlineWidth, tag: document.activeElement?.tagName };
    });
    expect(ring).toMatchObject({ style: "solid", width: "2px" });
  });

  test("espécime tipográfico com os 5 níveis Abissal (inclui serifa, sem o código de terminal)", async ({ page }) => {
    await expect(page.getByTestId("ds-type").locator("[data-type-level]")).toHaveCount(5);
    await expect(page.getByTestId("ds-type").locator('[data-type-level="code"]')).toHaveCount(0);
  });
});

// ---- Redesign Abissal (Task 4): componentes base ----
test.describe("componentes base Abissal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt/design-system/");
  });

  test("botão primário é pílula clara com ícone circular; ghost tem contorno", async ({ page }) => {
    const primary = page.getByTestId("ds-buttons").locator('[data-variant="primary"]').first();
    await expect(primary).toHaveCSS("background-color", "rgb(238, 243, 250)");
    await expect(primary.locator("[data-icon]")).toBeVisible();
    const ghost = page.getByTestId("ds-buttons").locator('[data-variant="ghost"]').first();
    await expect(ghost).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("botões e pílulas clicáveis têm alvo ≥ 44×44", async ({ page }) => {
    const targets = page.locator('[data-testid="ds-buttons"] a, [data-testid="ds-buttons"] button, [data-testid="ds-pills"] button');
    expect(await targets.count()).toBeGreaterThanOrEqual(3);
    for (const el of await targets.all()) {
      const box = await el.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });

  test("pílula diz o nível em texto acessível, não só pela luz", async ({ page }) => {
    // Na pílula-botão o nível só aparece como luz: o texto vem do .sr-only.
    const learning = page.getByTestId("ds-pills").locator('button[data-level="learning"] .sr-only');
    await expect(learning).toHaveText(/estudando/);
    for (const level of ["learning", "used", "proficient"]) {
      await expect(page.getByTestId("ds-pills").locator(`[data-level="${level}"] [data-dot]`).first()).toBeVisible();
    }
  });

  test("pílula-botão informa o estado pressionado e acende a borda", async ({ page }) => {
    const pills = page.getByTestId("ds-pills").locator("button[aria-pressed]");
    await expect(pills.first()).toHaveAttribute("aria-pressed", "true");
    await expect(pills.first()).toHaveCSS("border-color", "rgb(156, 196, 255)");
    await expect(pills.nth(1)).toHaveAttribute("aria-pressed", "false");
    await pills.nth(1).click();
    await expect(pills.nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(pills.first()).toHaveAttribute("aria-pressed", "false");
  });

  test("cartão de vidro usa o vidro Abissal", async ({ page }) => {
    const card = page.getByTestId("ds-cards").locator("[data-glass-card]").first();
    await expect(card).toBeVisible();
    expect(await card.evaluate((el) => getComputedStyle(el).backdropFilter)).toMatch(/blur\(14px\)/);
  });

  test("rótulo de seção no formato '01 — Nome'", async ({ page }) => {
    await expect(page.getByTestId("ds-cards").locator("[data-section-label]").first()).toHaveText(/^\d{2} — \S/);
  });

  test("frase serifada em pé, com trecho apagado e aceso", async ({ page }) => {
    const statement = page.getByTestId("ds-statement").locator("[data-statement]");
    await expect(statement).toHaveCSS("font-family", /Instrument Serif/);
    await expect(statement).toHaveCSS("font-style", "normal");
    await expect(statement.locator('[data-emphasis="dim"]')).toHaveCSS("color", "rgb(136, 151, 179)");
    await expect(statement.locator('[data-emphasis="lit"]').first()).toHaveCSS("color", "rgb(238, 243, 250)");
  });
});
