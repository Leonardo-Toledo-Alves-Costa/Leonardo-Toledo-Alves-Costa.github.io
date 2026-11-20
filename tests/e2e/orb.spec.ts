import { expect, test } from "@playwright/test";

// Redesign Abissal — orbe (spec §4.3). Demonstrado em /design-system até entrar no hero (Task 9).

test.describe("orbe CSS (sem JavaScript)", () => {
  test.use({ javaScriptEnabled: false });

  test("os três tamanhos aparecem, quadrados, em CSS", async ({ page }) => {
    await page.goto("/pt/design-system/");
    for (const variant of ["hero", "mini", "halo"]) {
      const orb = page.getByTestId("ds-orb").locator(`[data-orb][data-variant="${variant}"]`);
      await expect(orb, variant).toBeVisible();
      await expect(orb, variant).toHaveAttribute("data-renderer", "css");
      const box = await orb.boundingBox();
      expect(Math.abs((box?.width ?? 0) - (box?.height ?? 1)), variant).toBeLessThanOrEqual(1);
    }
  });

  test("é decorativo para leitores de tela", async ({ page }) => {
    await page.goto("/pt/design-system/");
    await expect(page.getByTestId("ds-orb").locator("[data-orb]").first()).toHaveAttribute("aria-hidden", "true");
  });

  test("esfera tem luz (gradiente) e halo cobalto", async ({ page }) => {
    await page.goto("/pt/design-system/");
    const orb = page.getByTestId("ds-orb").locator('[data-orb][data-variant="hero"]');
    const sphere = await orb.locator("[data-orb-sphere]").evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(sphere).toMatch(/radial-gradient/);
    const halo = await orb.locator("[data-orb-halo]").evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(halo).toMatch(/radial-gradient/);
    await expect(orb.locator("[data-orb-canvas-slot]")).toHaveCount(1);
  });
});

test("a variante halo tem a esfera mais apagada que a hero (quase só luz)", async ({ page }) => {
  await page.goto("/pt/design-system/");
  const opacity = (v: string) =>
    page.getByTestId("ds-orb").locator(`[data-orb][data-variant="${v}"] [data-orb-sphere]`).evaluate((el) => getComputedStyle(el).opacity);
  expect(await opacity("hero")).toBe("1");
  expect(await opacity("halo")).toBe("0.6");
});
