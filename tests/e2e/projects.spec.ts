import { expect, test } from "@playwright/test";
import { projects } from "../../src/content/projects";

test.describe("projetos /pt/", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pt/#projects");
  });

  test("um card por projeto, na ordem do conteúdo", async ({ page }) => {
    const ids = await page.locator("#projects [data-project-card]").evaluateAll((els) => els.map((e) => e.getAttribute("data-project-card")));
    expect(ids).toEqual(projects.map((p) => p.id));
  });

  test("ArborizAI mostra o prêmio e ocupa 2 colunas no desktop", async ({ page, isMobile }) => {
    const card = page.locator('#projects [data-project-card="arborizai"]');
    await expect(card).toContainText("JEWC/ENEJ");
    const width = (await card.boundingBox())!.width;
    const other = (await page.locator('#projects [data-project-card="dip-mobile"]').boundingBox())!.width;
    if (isMobile) expect(Math.abs(width - other)).toBeLessThan(2);
    else expect(width).toBeGreaterThan(other * 1.8);
  });

  test("projeto privado mostra o selo e não tem link quebrado", async ({ page }) => {
    for (const p of projects.filter((x) => x.visibility === "private")) {
      const card = page.locator(`#projects [data-project-card="${p.id}"]`);
      await expect(card.locator("[data-private]")).toHaveText("Código privado");
      for (const a of await card.locator("a").all()) await expect(a).toHaveAttribute("href", /^(https?:\/\/|#)/);
    }
  });

  test("chips das tecnologias de cada projeto", async ({ page }) => {
    for (const p of projects) {
      await expect(page.locator(`#projects [data-project-card="${p.id}"] [data-level]`)).toHaveCount(p.skills.length);
    }
    await expect(page.locator('#projects [data-project-card="dip-mobile"] [data-level]').first()).toContainText("Dart / Flutter");
  });

  test("selo 'Código privado' no topo do card, alinhado entre cards da mesma fileira", async ({ page, isMobile }) => {
    test.skip(isMobile, "uma coluna no celular");
    const tops = await page.evaluate(() =>
      ["arborizai", "dip-mobile"].map((id) => {
        const card = document.querySelector(`#projects [data-project-card="${id}"]`)!;
        const badge = card.querySelector("[data-private]")!;
        return { inHeader: !!badge.closest("header"), top: badge.getBoundingClientRect().top };
      }),
    );
    expect(tops.every((t) => t.inHeader)).toBe(true);
    expect(Math.abs(tops[0]!.top - tops[1]!.top)).toBeLessThan(2);
  });

  test("prêmio do destaque como pílula técnica", async ({ page }) => {
    const award = page.locator('#projects [data-project-card="arborizai"] [data-award]');
    await expect(award).toHaveCSS("border-top-style", "solid");
  });

  test("links externos dos cards: quantidade certa e rótulo com o nome do projeto", async ({ page }) => {
    // Hoje nenhum projeto tem link público; a contagem esperada evita um teste que passa "no vazio" sem perceber.
    const expected = projects.reduce((n, p) => n + (p.links?.repo ? 1 : 0) + (p.links?.demo ? 1 : 0), 0);
    const links = page.locator('#projects [data-project-card] a[target="_blank"]');
    await expect(links).toHaveCount(expected);
    for (const a of await links.all()) await expect(a).toHaveAttribute("aria-label", /— /);
  });

  test("slot livre completa a grade", async ({ page }) => {
    await expect(page.locator("#projects [data-slot]")).toHaveCount(1);
    await expect(page.locator("#projects [data-slot]")).toContainText(/slot livre/i);
  });

  test("títulos dos projetos são h3", async ({ page }) => {
    await expect(page.locator("#projects [data-project-card] h3")).toHaveCount(projects.length);
  });
});

test("inglês: selo e textos traduzidos", async ({ page }) => {
  await page.goto("/en/#projects");
  await expect(page.locator('#projects [data-project-card="dip-mobile"] [data-private]')).toHaveText("Private code");
  await expect(page.locator('#projects [data-project-card="dip-mobile"]')).toContainText("Real estate management");
  await expect(page.locator("#projects [data-slot]")).toContainText(/free slot/i);
});

test("rodapé de todos os cards encosta na base do card", async ({ page }) => {
  await page.goto("/pt/#projects");
  const gaps = await page.evaluate(() =>
    [...document.querySelectorAll("#projects [data-project-card] [data-spotlight]")].map((card) => {
      const footer = card.querySelector("footer")!;
      return card.getBoundingClientRect().bottom - footer.getBoundingClientRect().bottom;
    }),
  );
  // padding inferior do card (≤ 28px) é a única distância permitida.
  for (const g of gaps) expect(g).toBeLessThanOrEqual(30);
});

test("slot livre com borda tracejada legível", async ({ page }) => {
  await page.goto("/pt/#projects");
  await expect(page.locator("#projects [data-slot]")).toHaveCSS("border-top-style", "dashed");
  const color = await page.locator("#projects [data-slot]").evaluate((e) => getComputedStyle(e).borderTopColor);
  // Mais visível que a linha padrão (branco 8%).
  expect(color).not.toMatch(/0\.08\)/);
});
