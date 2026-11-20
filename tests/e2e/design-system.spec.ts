import { expect, test } from "@playwright/test";

const SECTIONS = ["colors", "type", "buttons", "pills", "cards", "statement", "orb", "chips", "glass", "spotlight", "terminal", "motion"];

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

  test("chip 'domino' usa o acento", async ({ page }) => {
    const chip = page.getByTestId("ds-chips").locator('[data-level="proficient"]').first();
    // accent-hi #9CC4FF em rgb, ou em oklab quando o Tailwind aplica opacidade com color-mix.
    await expect(chip).toHaveCSS("border-color", /156, 196, 255|oklab\(0\.8\d* /);
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

  test("espécime tipográfico com os 6 níveis (inclui serifa) e 3 cards de luz", async ({ page }) => {
    await expect(page.getByTestId("ds-type").locator("[data-type-level]")).toHaveCount(6);
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
  expect(filter).toMatch(/blur\(14px\)/);
});

test("borda do card de luz é só um anel (mask-composite exclude)", async ({ page }) => {
  await page.goto("/pt/design-system/");
  const composite = await page.getByTestId("ds-spotlight").locator("[data-spotlight]").first()
    .evaluate((el) => getComputedStyle(el, "::before").maskComposite);
  // Um valor por camada da máscara: "exclude, exclude". Antes da correção vinha "add, add".
  expect(composite).toMatch(/^exclude(, exclude)*$/);
});

test("GlassPanel com rounded-* próprio não recebe o raio padrão", async ({ page }) => {
  // A pílula de navegação de exemplo do bloco de vidro passa rounded-pill.
  await page.goto("/pt/design-system/");
  const cls = await page.getByTestId("ds-glass").locator("nav").first().getAttribute("class");
  expect(cls).not.toMatch(/(^|\s)rounded-panel(\s|$)/);
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
