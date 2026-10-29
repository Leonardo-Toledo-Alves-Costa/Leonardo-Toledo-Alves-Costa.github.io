import { expect, test } from "@playwright/test";

for (const [browserLocale, expected] of [
  ["pt-BR", "/pt/"],
  ["en-US", "/en/"],
  ["es-ES", "/pt/"],
] as const) {
  test.describe(`navegador ${browserLocale}`, () => {
    test.use({ locale: browserLocale });
    test(`vai para ${expected}`, async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(new RegExp(`${expected}$`));
    });
  });
}

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("mostra links para /pt/ e /en/", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/pt/"]')).toBeVisible();
    await expect(page.locator('a[href="/en/"]')).toBeVisible();
  });
});

test("html lang correto em cada idioma", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("título traduzido em cada idioma", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page).toHaveTitle(/Engenharia de Computação/);
  await page.goto("/en/");
  await expect(page).toHaveTitle(/Computer Engineering/);
});

test("rotas com barra final respondem 200 sem redirecionar", async ({ request }) => {
  for (const path of ["/pt/", "/en/"]) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status(), path).toBe(200);
  }
});

test("trocar idioma pela nav mantém o marcador de JS (botão de copiar continua visível)", async ({ page }) => {
  await page.goto("/pt/#contact");
  await page.getByTestId("locale-switch").first().click();
  await expect(page).toHaveURL(/\/en\//);
  await expect(page.getByTestId("copy-email")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/pt\//);
  await expect(page.getByTestId("copy-email")).toBeVisible();
});

test("rótulo da troca de idioma está no idioma do link (lang) — WCAG 3.1.2", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page.getByTestId("locale-switch").first()).toHaveAttribute("aria-label", "EN, View in English");
  await page.goto("/en/");
  await expect(page.getByTestId("locale-switch").first()).toHaveAttribute("aria-label", "PT, Ver em português");
});
