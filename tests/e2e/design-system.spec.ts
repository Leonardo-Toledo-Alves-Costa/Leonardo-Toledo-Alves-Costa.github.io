import { expect, test } from "@playwright/test";

const SECTIONS = ["colors", "type", "buttons", "chips", "glass", "spotlight", "terminal", "motion"];

test.describe("página /design-system", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt/design-system/");
  });

  test("todas as seções do design system renderizam", async ({ page }) => {
    for (const s of SECTIONS) await expect(page.getByTestId(`ds-${s}`)).toBeVisible();
  });

  test("tokens aplicados no body", async ({ page }) => {
    const body = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      return { bg: s.backgroundColor, color: s.color, font: s.fontFamily };
    });
    expect(body.bg).toBe("rgb(0, 0, 0)");
    expect(body.color).toBe("rgb(245, 245, 247)");
    expect(body.font).toMatch(/Geist/);
  });

  test("chip 'domino' usa o sinal verde", async ({ page }) => {
    const chip = page.getByTestId("ds-chips").locator('[data-level="proficient"]').first();
    // #7CFF6B em rgb, ou em oklab quando o Tailwind aplica opacidade com color-mix.
    await expect(chip).toHaveCSS("border-color", /124, 255, 107|oklab\(0\.89\d* -0\.17\d* 0\.13\d*/);
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

  test("chip interativo é botão com aria-pressed e alvo de toque ≥ 44px", async ({ page }) => {
    const chip = page.getByTestId("ds-chips").locator("button[data-level]").first();
    await expect(chip).toHaveAttribute("aria-pressed", "false");
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    const hit = await chip.evaluate((el) => {
      const after = getComputedStyle(el, "::after");
      return el.getBoundingClientRect().height - parseFloat(after.top) - parseFloat(after.bottom);
    });
    expect(hit).toBeGreaterThanOrEqual(44);
  });

  test("luz do card visível em repouso (celular não tem hover) e borda não recortada", async ({ page }) => {
    const card = page.getByTestId("ds-spotlight").locator("[data-spotlight]").first();
    const before = await card.evaluate((el) => {
      const s = getComputedStyle(el, "::before");
      return { opacity: Number(s.opacity), top: s.top, left: s.left };
    });
    expect(before.opacity).toBeGreaterThan(0);
    expect(before).toMatchObject({ top: "0px", left: "0px" });
  });

  test("ponteiro sobre o vidro define --mx/--my", async ({ page, isMobile }) => {
    test.skip(isMobile, "sem ponteiro no celular");
    // A preferência do sistema operacional vaza para o navegador de teste: fixamos explicitamente.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.reload();
    const panel = page.getByTestId("ds-glass").locator("[data-glass]").first();
    await panel.scrollIntoViewIfNeeded();
  const box = await panel.boundingBox();
    if (!box) throw new Error("painel sem caixa");
    await page.mouse.move(box.x + 40, box.y + 20);
    await page.mouse.move(box.x + 60, box.y + 30);
    await expect(panel).toHaveAttribute("style", /--mx: ?\d/);
  });

  test("palco do vidro tem trilhas de circuito decorativas e a pílula de navegação", async ({ page }) => {
    const stage = page.getByTestId("ds-glass");
    await expect(stage.locator('svg[aria-hidden="true"] path').first()).toBeAttached();
    await expect(stage.locator("nav[data-glass]")).toBeVisible();
  });

  test("espécime tipográfico com os 5 níveis e 3 cards de luz", async ({ page }) => {
    await expect(page.getByTestId("ds-type").locator("[data-type-level]")).toHaveCount(5);
    await expect(page.getByTestId("ds-spotlight").locator("[data-spotlight]")).toHaveCount(3);
  });
});

test("com 'reduzir movimento' a luz não segue o ponteiro", async ({ page, isMobile }) => {
  test.skip(isMobile, "sem ponteiro no celular");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pt/design-system/");
  const panel = page.getByTestId("ds-glass").locator("[data-glass]").first();
  await panel.scrollIntoViewIfNeeded();
  const box = await panel.boundingBox();
  if (!box) throw new Error("painel sem caixa");
  await page.mouse.move(box.x + 40, box.y + 20);
  await page.mouse.move(box.x + 60, box.y + 30);
  await expect(panel).not.toHaveAttribute("style", /--mx/);
});

test("vidro desfoca o fundo de verdade (backdrop-filter aplicado)", async ({ page }) => {
  await page.goto("/pt/design-system/");
  const filter = await page.getByTestId("ds-glass").locator("[data-glass]").first().evaluate((el) => getComputedStyle(el).backdropFilter);
  expect(filter).toMatch(/blur\(18px\)/);
});

test("borda do card de luz é só um anel (mask-composite exclude)", async ({ page }) => {
  await page.goto("/pt/design-system/");
  const composite = await page.getByTestId("ds-spotlight").locator("[data-spotlight]").first()
    .evaluate((el) => getComputedStyle(el, "::before").maskComposite);
  // Um valor por camada da máscara: "exclude, exclude". Antes da correção vinha "add, add".
  expect(composite).toMatch(/^exclude(, exclude)*$/);
});
