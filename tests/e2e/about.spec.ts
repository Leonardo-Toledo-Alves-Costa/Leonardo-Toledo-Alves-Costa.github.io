import { expect, test } from "@playwright/test";

const SPECS = {
  pt: [["Formação", "Eng. de Computação"], ["Período", "4º período"], ["Pesquisa", "Iniciação Científica"], ["Liderança", "Diretor de Projetos"]],
  en: [["Education", "B.Sc. Computer Engineering"], ["Stage", "4th semester"], ["Research", "Undergraduate research"], ["Leadership", "Director of Projects"]],
} as const;

for (const locale of ["pt", "en"] as const) {
  test.describe(`sobre /${locale}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/#about`);
    });

    test("bio do perfil presente", async ({ page }) => {
      await expect(page.locator("#about")).toContainText(locale === "pt" ? "Engenharia de Computação na UNIFEI" : "Computer Engineering undergraduate at UNIFEI");
    });

    test("4 cards de especificação com rótulo e valor", async ({ page }) => {
      const cards = page.locator("#about [data-spec]");
      await expect(cards).toHaveCount(4);
      for (const [i, [label, value]] of SPECS[locale].entries()) {
        await expect(cards.nth(i)).toContainText(label);
        await expect(cards.nth(i)).toContainText(value);
      }
    });

    test("cards como lista de definições (rótulo → valor)", async ({ page }) => {
      await expect(page.locator("#about dl dt")).toHaveCount(4);
      await expect(page.locator("#about dl dd")).toHaveCount(4);
    });
  });
}

test("celular: cards em 2 colunas; desktop: 4", async ({ page, isMobile }) => {
  await page.goto("/pt/#about");
  const tops = await page.locator("#about [data-spec]").evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  const rows = new Set(tops).size;
  expect(rows).toBe(isMobile ? 2 : 1);
});

test("estrutura válida de lista de definições (dl > div > dt/dd)", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page.locator("#about dl > div > dt")).toHaveCount(4);
  await expect(page.locator("#about dl > div > dd")).toHaveCount(4);
});

test("valor do card separa principal e complemento (sem ' · ' quebrando linha)", async ({ page }) => {
  await page.goto("/pt/");
  const first = page.locator("#about [data-spec]").first();
  await expect(first.locator("[data-spec-main]")).toHaveText("Eng. de Computação");
  await expect(first.locator("[data-spec-sub]")).toHaveText("UNIFEI");
});

test("vidro dos cards tem a placa por trás (não é card cinza liso)", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page.locator("#about .pcb-grid")).toHaveCount(1);
});

test("grade de PCB não divide elemento com outro background (sem efeito xadrez)", async ({ page }) => {
  await page.goto("/pt/");
  for (const el of await page.locator(".pcb-grid").all()) {
    const bg = await el.evaluate((e) => getComputedStyle(e).backgroundImage);
    expect(bg).not.toMatch(/radial-gradient/);
    expect(bg).toMatch(/linear-gradient/);
  }
});

test("leitor de tela não cola principal e complemento", async ({ page }) => {
  await page.goto("/pt/");
  const text = await page.locator("#about [data-spec] dd").first().textContent();
  expect(text).not.toMatch(/ComputaçãoUNIFEI/);
});
