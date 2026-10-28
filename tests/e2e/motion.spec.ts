import { expect, test } from "@playwright/test";

const URL = "/pt/design-system/";

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("texto de Reveal e BootSequence visível e completo", async ({ page }) => {
    await page.goto(URL);
    const motion = page.getByTestId("ds-motion");
    for (const sel of ["[data-reveal]", "[data-boot]"]) {
      const opacity = await motion.locator(sel).first().evaluate((el) => getComputedStyle(el).opacity);
      expect(opacity, sel).toBe("1");
      await expect(motion.locator(sel).first()).toBeVisible();
    }
    await expect(motion.locator("[data-boot]")).toContainText("ok");
  });
});

test.describe("com 'reduzir movimento'", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(URL);
  });

  test("ChromeText sem animação", async ({ page }) => {
    const name = await page.getByTestId("ds-motion").locator("[data-chrome]").first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(name).toBe("none");
  });

  test("BootSequence mostra todas as linhas de uma vez", async ({ page }) => {
    const boot = page.getByTestId("ds-motion").locator("[data-boot]");
    await expect(boot).toHaveAttribute("data-state", "done");
    await expect(boot.locator("[data-boot-line]")).toHaveCount(3);
  });

  test("pulsos das trilhas desligados", async ({ page }) => {
    const pulses = page.getByTestId("ds-motion").locator("[data-pulse]");
    expect(await pulses.count()).toBeGreaterThan(0);
    for (const p of await pulses.all()) await expect(p).toBeHidden();
  });
});

test.describe("com movimento", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(URL);
  });

  test("ChromeText anima o reflexo", async ({ page }) => {
    const name = await page.getByTestId("ds-motion").locator("[data-chrome]").first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(name).not.toBe("none");
  });

  test("BootSequence digita até terminar", async ({ page }) => {
    const boot = page.getByTestId("ds-motion").locator("[data-boot]");
    // Começa digitando (não aparece pronto).
    await expect(boot).not.toHaveAttribute("data-state", "done");
    await boot.scrollIntoViewIfNeeded();
    await expect(boot).toHaveAttribute("data-state", "done", { timeout: 10_000 });
    await expect(boot).toContainText("ok");
  });
});

test.describe("Reveal", () => {
  test("com movimento: abaixo da dobra começa oculto e aparece ao rolar", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(URL);
    const reveal = page.getByTestId("ds-motion").locator("[data-reveal]");
    await expect(reveal).toHaveCSS("opacity", "0");
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS("opacity", "1");
  });

  test("com 'reduzir movimento': visível desde o início", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(URL);
    await expect(page.getByTestId("ds-motion").locator("[data-reveal]")).toHaveCSS("opacity", "1");
  });
});

test("reflexo cromado dimensionado pelo texto, não pelo container", async ({ page, isMobile }) => {
  // No celular o nome quebra em 2 linhas e ocupa a largura toda — correto para fit-content.
  test.skip(isMobile, "nome quebra linha no celular");
  await page.goto(URL);
  const chrome = page.getByTestId("ds-motion").locator("[data-chrome]");
  const widths = await chrome.evaluate((el) => ({ el: el.getBoundingClientRect().width, parent: el.parentElement!.getBoundingClientRect().width }));
  expect(widths.el).toBeLessThan(widths.parent);
});

test("trilhas da placa terminam em pads (vias)", async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByTestId("ds-motion").locator('svg[data-variant="board"] circle[data-pad]')).toHaveCount(4);
});

test("CircuitTraces acende a trilha ativa em verde", async ({ page }) => {
  await page.goto(URL);
  const active = page.getByTestId("ds-motion").locator('[data-trace-id="software"][data-active="true"]');
  await expect(active).toHaveCount(1);
  await expect(active).toHaveCSS("stroke", "rgb(124, 255, 107)");
  const idle = page.getByTestId("ds-motion").locator('[data-trace-id="cloud"]');
  await expect(idle).toHaveAttribute("data-active", "false");
});

test("placa tem as 4 trilhas de categoria e é decorativa", async ({ page }) => {
  await page.goto(URL);
  const board = page.getByTestId("ds-motion").locator('svg[data-variant="board"]');
  await expect(board).toHaveAttribute("aria-hidden", "true");
  for (const id of ["software", "cloud", "engineering", "hardware-ai"]) {
    await expect(board.locator(`[data-trace-id="${id}"]`)).toHaveCount(1);
  }
});
