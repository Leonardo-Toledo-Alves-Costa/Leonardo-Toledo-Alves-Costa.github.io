import { expect, test } from "@playwright/test";

// Reveal (motion/): conteúdo visível sem JS e com "reduzir movimento"; abaixo da dobra entra ao rolar.
const URL = "/pt/design-system/";

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

  test.describe("sem JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test("visível e completo", async ({ page }) => {
      await page.goto(URL);
      const reveal = page.getByTestId("ds-motion").locator("[data-reveal]");
      expect(await reveal.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
      await expect(reveal).toBeVisible();
    });
  });
});
