import { expect, test } from "@playwright/test";

test("página inicial gerada responde", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.ok()).toBe(true);
});
