import { expect, test } from "@playwright/test";
import { skills } from "../../src/content/skills";
import { skillsByCategory } from "../../src/lib/content";

// Contagens derivadas do conteúdo: adicionar uma tecnologia não quebra o teste.
const COUNTS = Object.fromEntries(Object.entries(skillsByCategory(skills)).map(([k, v]) => [k, v.length]));

test.describe("placa de stack (/pt/)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt/#stack");
  });

  test("4 zonas de categoria com seus chips", async ({ page }) => {
    for (const [cat, n] of Object.entries(COUNTS)) {
      await expect(page.locator(`#stack [data-zone="${cat}"] button[data-level]`), cat).toHaveCount(n);
    }
  });

  test("legenda com os 3 níveis", async ({ page }) => {
    const legend = page.getByTestId("stack-legend");
    for (const t of ["estudando", "usei em projeto", "domino"]) await expect(legend).toContainText(t);
  });

  test("começa com uma tecnologia dominada selecionada", async ({ page }) => {
    await expect(page.locator('#stack button[data-level][aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator('#stack button[aria-pressed="true"]')).toHaveAttribute("data-level", "proficient");
  });

  test("clicar num chip mostra nível e projetos que o usam", async ({ page }) => {
    await page.locator("#stack button", { hasText: "Dart / Flutter" }).click();
    const detail = page.getByTestId("stack-detail");
    await expect(detail).toContainText("Dart / Flutter");
    await expect(detail).toContainText("domino");
    await expect(detail).toContainText("DIP Mobile");
    await expect(detail).toContainText("Softcare Mobile");
  });

  test("tecnologia sem projeto listado mostra estado neutro", async ({ page }) => {
    await page.locator("#stack button", { hasText: "Robótica" }).click();
    const detail = page.getByTestId("stack-detail");
    await expect(detail).toContainText("estudando");
    await expect(detail.locator("[data-project]")).toHaveCount(0);
    await expect(detail).toContainText("Sem projeto listado");
  });

  test("teclado: Tab + Enter seleciona; aria-pressed acompanha", async ({ page }) => {
    await page.locator("#stack button", { hasText: "Google Cloud" }).focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    const chip = page.locator("#stack button", { hasText: "Docker" });
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('#stack button[aria-pressed="true"]')).toHaveCount(1);
    await expect(page.getByTestId("stack-detail")).toContainText("Docker");
  });

  test("detalhe é anunciado inteiro (aria-atomic)", async ({ page }) => {
    await expect(page.getByTestId("stack-detail")).toHaveAttribute("aria-atomic", "true");
  });

  test("chip selecionado se distingue de um 'domino' em repouso", async ({ page }) => {
    await page.locator("#stack button", { hasText: "Docker" }).click();
    const selected = await page.locator("#stack button", { hasText: "Docker" }).evaluate((e) => getComputedStyle(e).backgroundColor);
    const idle = await page.locator("#stack button", { hasText: "Scrum" }).evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(selected).not.toBe(idle);
  });

  test("alvos de toque ≥ 44px: chips curtos e links de projeto", async ({ page }) => {
    const c = await page.locator("#stack button[data-level]", { hasText: /^C$/ }).boundingBox();
    expect(c!.width).toBeGreaterThanOrEqual(44);
    await page.locator("#stack button", { hasText: "Dart / Flutter" }).click();
    const link = await page.getByTestId("stack-detail").locator("a").first().boundingBox();
    expect(link!.height).toBeGreaterThanOrEqual(44);
  });

  test("zonas opacas (trilhas não vazam por baixo dos chips)", async ({ page }) => {
    const bg = await page.locator('#stack [data-zone="software"]').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(bg).toBe("rgb(10, 11, 10)");
  });

  test("detalhe é anunciado (aria-live polite)", async ({ page }) => {
    await expect(page.getByTestId("stack-detail")).toHaveAttribute("aria-live", "polite");
  });

  test("trilha da zona selecionada acende", async ({ page, isMobile }) => {
    test.skip(isMobile, "no celular a placa vira lista empilhada, sem trilhas");
    await page.locator("#stack button", { hasText: "Docker" }).click();
    await expect(page.locator('#stack [data-trace-id="cloud"]')).toHaveAttribute("data-active", "true");
    await expect(page.locator('#stack [data-trace-id="software"]')).toHaveAttribute("data-active", "false");
  });
});

test("celular: detalhe aparece logo abaixo da zona escolhida", async ({ page, isMobile }) => {
  test.skip(!isMobile, "só no celular");
  await page.goto("/pt/#stack");
  await page.locator("#stack button", { hasText: "Docker" }).click();
  const zone = await page.locator('#stack [data-zone="cloud"]').boundingBox();
  const detail = await page.getByTestId("stack-detail").boundingBox();
  const next = await page.locator('#stack [data-zone="engineering"]').boundingBox();
  expect(detail!.y).toBeGreaterThan(zone!.y + zone!.height - 1);
  expect(detail!.y + detail!.height).toBeLessThanOrEqual(next!.y + 1);
});

test("inglês: nomes e níveis traduzidos", async ({ page }) => {
  await page.goto("/en/#stack");
  await page.locator("#stack button", { hasText: "Robotics" }).click();
  await expect(page.getByTestId("stack-detail")).toContainText("learning");
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("todas as tecnologias aparecem com seu nível", async ({ page }) => {
    await page.goto("/pt/#stack");
    await expect(page.locator("#stack button[data-level]")).toHaveCount(skills.length);
    await expect(page.getByTestId("stack-detail")).toBeVisible();
  });
});

test("desktop: pads das trilhas visíveis no corredor entre zonas e painel", async ({ page, isMobile }) => {
  test.skip(isMobile, "sem trilhas no celular");
  await page.goto("/pt/#stack");
  const zone = await page.locator('#stack [data-zone="software"]').boundingBox();
  const pad = await page.locator('#stack svg[data-variant="board"] circle[data-pad]').first().boundingBox();
  // Centro do pad logo fora da borda direita da zona, no corredor (visível).
  const gap = pad!.x + pad!.width / 2 - (zone!.x + zone!.width);
  expect(gap).toBeGreaterThanOrEqual(2);
  expect(gap).toBeLessThan(28);
});
