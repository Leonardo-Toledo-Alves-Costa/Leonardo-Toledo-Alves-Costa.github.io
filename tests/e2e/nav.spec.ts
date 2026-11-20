import { expect, test } from "@playwright/test";

// Redesign Abissal (Task 5): barra larga com nome, âncoras, rota de projetos e idioma.

test("desktop: itens na ordem Sobre, Trajetória, Projetos, Contato", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular os itens ficam no menu");
  await page.goto("/pt/");
  const links = page.getByTestId("site-nav").locator("ul[data-nav-desktop] a");
  await expect(links).toHaveText(["sobre", "trajetória", "projetos", "contato"]);
  await expect(links.nth(0)).toHaveAttribute("href", "#about");
  await expect(links.nth(1)).toHaveAttribute("href", "#timeline");
  await expect(links.nth(2)).toHaveAttribute("href", "/pt/projetos/");
  await expect(links.nth(3)).toHaveAttribute("href", "#contact");
});

test("nome do autor leva ao topo e é alvo de toque ≥ 44px", async ({ page }) => {
  await page.goto("/pt/");
  const name = page.getByTestId("site-nav").locator('a[href="#hero"]');
  await expect(name).toHaveText("Leonardo Tolêdo");
  const box = await name.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test("cabeçalho tem nome de transição próprio (não pisca entre rotas)", async ({ page }) => {
  await page.goto("/pt/");
  const name = await page.locator("header").first().evaluate((el) => getComputedStyle(el).viewTransitionName);
  expect(name).toBe("site-header");
});

test("cabeçalho transparente no topo e com fundo depois de rolar", async ({ page }) => {
  await page.goto("/pt/");
  const header = page.locator("header").first();
  await expect(header).toHaveAttribute("data-scrolled", "false");
  await page.mouse.wheel(0, 900);
  await expect(header).toHaveAttribute("data-scrolled", "true");
  const bg = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe("rgba(0, 0, 0, 0)");
});

test("mobile: menu abre com os mesmos destinos", async ({ page, isMobile }) => {
  test.skip(!isMobile, "só no celular");
  await page.goto("/pt/");
  await page.getByTestId("menu-toggle").click();
  const links = page.locator("#menu-mobile a");
  await expect(links).toHaveText(["sobre", "trajetória", "projetos", "contato"]);
  await expect(links.nth(2)).toHaveAttribute("href", "/pt/projetos/");
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("o link de idioma já vem com o caminho certo no HTML", async ({ page }) => {
    await page.goto("/pt/");
    await expect(page.getByTestId("locale-switch").first()).toHaveAttribute("href", "/en/");
    await page.goto("/en/");
    await expect(page.getByTestId("locale-switch").first()).toHaveAttribute("href", "/pt/");
  });
});
