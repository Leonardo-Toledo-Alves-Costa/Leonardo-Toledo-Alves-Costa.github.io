import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../src/content/projects";
import { en } from "../../src/i18n/dictionaries/en";
import { pt } from "../../src/i18n/dictionaries/pt";
import { localize } from "../../src/lib/content";

// Redesign Abissal — capítulos dos projetos em /projetos (spec §6.2 item 3, §6.3).

const chapter = (page: Page, id: string) => page.locator(`[data-chapter="${id}"]`);

/** Abre /projetos e espera a hidratação dos palcos (no desktop eles viram animados) antes de rolar. */
async function hydrated(page: Page) {
  await page.goto("/pt/projetos/", { waitUntil: "networkidle" });
  await page.locator('[data-beat][data-state="active"]').first().waitFor({ state: "attached" });
}

/** Rola até a fração `f` do palco do capítulo (0 = topo do palco no topo da tela, 1 = fim). */
async function toChapter(page: Page, id: string, f: number) {
  await page.evaluate(
    ([cid, frac]) => {
      const el = document.querySelector<HTMLElement>(`[data-chapter="${cid}"]`);
      if (!el) throw new Error(`sem capítulo ${cid}`);
      const top = el.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + Math.max(0, el.offsetHeight - innerHeight) * Number(frac), behavior: "instant" });
    },
    [id, String(f)] as const,
  );
}

const opacityOf = (page: Page, id: string, kind: string) =>
  chapter(page, id)
    .locator(`[data-card="${kind}"]`)
    .evaluate((e) => Number(getComputedStyle(e).opacity));

for (const locale of ["pt", "en"] as const) {
  const dict = locale === "pt" ? pt : en;
  test(`/${locale}/projetos/: um capítulo por projeto, na ordem do conteúdo, com nome e tagline`, async ({ page }) => {
    await page.goto(`/${locale}/projetos/`);
    const ids = await page.locator("[data-chapter]").evaluateAll((els) => els.map((e) => e.getAttribute("data-chapter")));
    expect(ids).toEqual(projects.map((p) => p.id));
    for (const p of projects) {
      await expect(chapter(page, p.id).locator("h3")).toHaveText(p.name);
      await expect(chapter(page, p.id).locator("[data-tagline]")).toHaveText(localize(p.tagline, locale));
      await expect(chapter(page, p.id).locator('[data-card="delivery"]')).toContainText(localize(p.description, locale));
    }
  });

  test(`/${locale}/projetos/: papel só com fonte real; prêmio só no ArborizAI`, async ({ page }) => {
    await page.goto(`/${locale}/projetos/`);
    await expect(chapter(page, "arborizai").locator('[data-card="role"]')).toHaveCount(0);
    await expect(chapter(page, "arborizai").locator('[data-card="award"]')).toContainText("JEWC/ENEJ");
    await expect(chapter(page, "dip-mobile").locator('[data-card="role"]')).toContainText(locale === "pt" ? "Desenvolvedor Mobile" : "Mobile Software Developer");
    await expect(chapter(page, "dip-mobile").locator('[data-card="role"]')).toContainText(dict.projectsPage.roleLabel);
    for (const id of ["dip-mobile", "softcare-mobile", "teccurar-infra"]) {
      await expect(chapter(page, id).locator('[data-card="award"]')).toHaveCount(0);
    }
  });
}

test("stack do capítulo em pílulas com as skills do projeto", async ({ page }) => {
  await page.goto("/pt/projetos/");
  const infra = projects.find((p) => p.id === "teccurar-infra")!;
  await expect(chapter(page, infra.id).locator('[data-card="stack"] [data-level]')).toHaveCount(infra.skills.length);
});

test("sem imagem (media) nem diagrama: nenhum espaço visual vazio nos capítulos", async ({ page }) => {
  await page.goto("/pt/projetos/");
  await expect(page.locator("[data-chapter] img")).toHaveCount(0);
  await expect(page.locator("[data-chapter] [data-visual]")).toHaveCount(0);
});

test("desktop: cartões entram e saem com a rolagem do capítulo", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular os capítulos são blocos normais");
  await hydrated(page);
  await toChapter(page, "dip-mobile", 0);
  await expect.poll(() => opacityOf(page, "dip-mobile", "delivery")).toBeLessThan(0.5);
  await toChapter(page, "dip-mobile", 0.6);
  await expect.poll(() => opacityOf(page, "dip-mobile", "delivery")).toBe(1);
  await toChapter(page, "dip-mobile", 0.99);
  await expect.poll(() => opacityOf(page, "dip-mobile", "delivery")).toBeLessThan(0.3);
});

test("celular com JS: capítulos são blocos normais, cartões parados e visíveis", async ({ page, isMobile }) => {
  test.skip(!isMobile, "regra do celular");
  await page.goto("/pt/projetos/", { waitUntil: "networkidle" });
  for (const p of projects) {
    const el = chapter(page, p.id);
    expect(await el.evaluate((e) => getComputedStyle(e.firstElementChild!).position), p.id).not.toBe("sticky");
    // Empilhado: os cartões começam abaixo do nome.
    const name = await el.locator("h3").boundingBox();
    const first = await el.locator("[data-card]").first().boundingBox();
    if (!name || !first) throw new Error(p.id);
    expect(first.y, p.id).toBeGreaterThan(name.y + name.height);
    for (const card of await el.locator("[data-card]").all()) {
      await card.scrollIntoViewIfNeeded();
      expect(await card.evaluate((e) => Number(getComputedStyle(e).opacity)), p.id).toBe(1);
    }
  }
});

test("tablet 768px: duas colunas e nada vaza da tela fixa", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await hydrated(page);
  for (const p of projects) {
    await toChapter(page, p.id, 0.6);
    const cards = chapter(page, p.id).locator("[data-card]");
    const name = await chapter(page, p.id).locator("h3").boundingBox();
    const first = await cards.first().boundingBox();
    const last = await cards.last().boundingBox();
    if (!name || !first || !last) throw new Error(p.id);
    expect(name.x + name.width, p.id).toBeLessThanOrEqual(first.x);
    expect(last.y + last.height, p.id).toBeLessThanOrEqual(1024);
  }
});

test("cartões não esticam além do conteúdo; prêmio com destaque", async ({ page }) => {
  await page.goto("/pt/projetos/");
  const card = await chapter(page, "dip-mobile").locator('[data-card="role"] [data-glass-card]').boundingBox();
  const text = await chapter(page, "dip-mobile").locator('[data-card="role"] p').last().boundingBox();
  if (!card || !text) throw new Error("sem caixa do cartão de papel");
  expect(card.y + card.height - (text.y + text.height)).toBeLessThan(40);
  await expect(chapter(page, "arborizai").locator('[data-card="award"] [data-glass-card]')).not.toHaveCSS("border-color", "rgba(255, 255, 255, 0.14)");
});

for (const [name, use] of [
  ["sem JavaScript", { javaScriptEnabled: false }],
  ["reduzir movimento", { reducedMotion: "reduce" as const }],
] as const) {
  test.describe(name, () => {
    test.use(use);
    test("todos os cartões de todos os capítulos visíveis, com respiro entre capítulos", async ({ page }) => {
      await page.goto("/pt/projetos/");
      const cards = page.locator("[data-chapter] [data-card]");
      expect(await cards.count()).toBeGreaterThanOrEqual(projects.length * 2);
      for (const card of await cards.all()) {
        await card.scrollIntoViewIfNeeded();
        await expect(card).toBeVisible();
        expect(await card.evaluate((e) => Number(getComputedStyle(e).opacity))).toBe(1);
      }
      const pad = await chapter(page, "dip-mobile").locator(":scope > div > div").first().evaluate((e) => parseFloat(getComputedStyle(e).paddingTop));
      expect(pad).toBeGreaterThanOrEqual(48);
    });
  });
}

test("nome do projeto não invade a coluna dos cartões (nomes longos quebram)", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular as colunas empilham");
  await hydrated(page);
  for (const p of projects) {
    await toChapter(page, p.id, 0.6);
    const name = await chapter(page, p.id).locator("h3").boundingBox();
    const cards = await chapter(page, p.id).locator("[data-card]").first().boundingBox();
    if (!name || !cards) throw new Error(`sem caixa em ${p.id}`);
    expect(name.x + name.width, p.id).toBeLessThanOrEqual(cards.x);
  }
});

test("sem JavaScript: só há traço entre capítulos, não acima do primeiro", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/pt/projetos/");
  const borders = await page
    .locator("[data-chapter] > div > div")
    .evaluateAll((els) => els.filter((e) => e.closest("[data-chapter]")?.firstElementChild?.firstElementChild === e).map((e) => getComputedStyle(e).borderTopWidth));
  expect(borders[0]).toBe("0px");
  expect(borders.slice(1).every((b) => b === "1px")).toBe(true);
  await ctx.close();
});
