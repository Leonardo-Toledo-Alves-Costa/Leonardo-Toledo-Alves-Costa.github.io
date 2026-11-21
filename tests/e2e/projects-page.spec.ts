import { expect, test } from "@playwright/test";
import { profile } from "../../src/content/profile";
import { projects } from "../../src/content/projects";
import { skills } from "../../src/content/skills";
import { en } from "../../src/i18n/dictionaries/en";
import { pt } from "../../src/i18n/dictionaries/pt";
import { localize } from "../../src/lib/content";
import { splitEmphasis } from "../../src/lib/emphasis";
import { SITE_URL as SITE } from "../../src/lib/site";

// Redesign Abissal — rota /projetos (spec §6, Task 16): estática, indexável e legível sem JS.

const dicts = { pt, en } as const;

for (const locale of ["pt", "en"] as const) {
  test.describe(`/${locale}/projetos/`, () => {
    test("responde 200 sem redirecionar", async ({ request }) => {
      const res = await request.get(`/${locale}/projetos/`, { maxRedirects: 0 });
      expect(res.status()).toBe(200);
    });

    test("metadata própria, canonical e hreflang", async ({ page }) => {
      await page.goto(`/${locale}/projetos/`);
      await expect(page).toHaveTitle(dicts[locale].projectsPage.metaTitle);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", dicts[locale].projectsPage.description);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/${locale}/projetos/`);
      await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute("href", `${SITE}/pt/projetos/`);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", `${SITE}/en/projetos/`);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", `${SITE}/pt/projetos/`);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `${SITE}/${locale}/projetos/`);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", dicts[locale].projectsPage.metaTitle);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${SITE}/og.png`);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    });

    test("abre com o halo do orbe, a frase F4 e um h1", async ({ page }) => {
      await page.goto(`/${locale}/projetos/`);
      await expect(page.locator('[data-projects-intro] [data-orb][data-variant="halo"]')).toHaveCount(1);
      const f4 = splitEmphasis(dicts[locale].statements.f4).map((s) => s.text).join("");
      await expect(page.locator("[data-projects-intro] [data-statement]")).toHaveText(f4);
      await expect(page.locator("h1")).toHaveText(dicts[locale].projectsPage.title);
    });

    test("nav marca Projetos como página atual e leva as âncoras para a home", async ({ page }) => {
      await page.goto(`/${locale}/projetos/`);
      const nav = page.getByTestId("site-nav");
      await expect(nav.locator(`a[href="/${locale}/projetos/"]`).first()).toHaveAttribute("aria-current", "page");
      await expect(nav.locator(`a[href="/${locale}/#about"]`).first()).toBeAttached();
    });

    test("fecha com contato e volta ao início", async ({ page }) => {
      await page.goto(`/${locale}/projetos/`);
      const outro = page.locator("[data-projects-outro]");
      await expect(outro.locator(`a[href="mailto:${profile.email}"]`)).toHaveCount(1);
      await expect(outro.locator(`a[href="${profile.links.github}"]`)).toHaveCount(1);
      await expect(outro.locator(`a[href="${profile.links.linkedin}"]`)).toHaveCount(1);
      const back = outro.locator("[data-back-home]");
      await expect(back).toHaveAttribute("href", `/${locale}/`);
      await expect(back).toHaveText(dicts[locale].projectsPage.backHome);
    });
  });
}

test("troca de idioma preserva a rota de projetos", async ({ page }) => {
  await page.goto("/pt/projetos/");
  await expect(page.getByTestId("locale-switch").first()).toHaveAttribute("href", "/en/projetos/");
  await page.goto("/en/projetos/");
  await expect(page.getByTestId("locale-switch").first()).toHaveAttribute("href", "/pt/projetos/");
});

test("sitemap tem as duas URLs de projetos", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain(`<loc>${SITE}/pt/projetos/</loc>`);
  expect(xml).toContain(`<loc>${SITE}/en/projetos/</loc>`);
});

test("com JS, as palavras da F4 entram uma a uma", async ({ page }) => {
  await page.goto("/pt/projetos/");
  const words = page.locator("[data-projects-intro] [data-statement] [data-word]");
  expect(await words.count()).toBeGreaterThan(1);
  const anim = await words.evaluateAll((els) => els.map((e) => ({ name: getComputedStyle(e).animationName, delay: getComputedStyle(e).animationDelay })));
  expect(anim.every((a) => a.name !== "none")).toBe(true);
  expect(new Set(anim.map((a) => a.delay)).size).toBeGreaterThan(1);
});

test.describe("reduzir movimento", () => {
  test.use({ reducedMotion: "reduce" });
  test("F4 inteira e parada desde o início", async ({ page }) => {
    await page.goto("/pt/projetos/");
    const words = await page.locator("[data-projects-intro] [data-word]").all();
    expect(words.length).toBeGreaterThan(1);
    for (const word of words) {
      expect(await word.evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
      expect(await word.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
    }
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("todas as skills e projetos visíveis; F4 sem animação", async ({ page }) => {
    await page.goto("/pt/projetos/");
    for (const skill of skills) {
      await expect(page.locator("main").getByText(localize(skill.name, "pt"), { exact: true }).first(), skill.id).toBeVisible();
    }
    for (const project of projects) {
      await expect(page.locator("main").getByRole("heading", { name: project.name }), project.id).toBeVisible();
    }
    const word = page.locator("[data-projects-intro] [data-word]").first();
    expect(await word.evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
  });
});

test("abertura ocupa a primeira tela inteira (palco limpo)", async ({ page }) => {
  await page.goto("/pt/projetos/");
  const { h, vh } = await page.evaluate(() => ({ h: document.querySelector("[data-projects-intro]")!.getBoundingClientRect().height, vh: innerHeight }));
  expect(h).toBeGreaterThanOrEqual(vh - 1);
});

test("e-mail do painel cabe inteiro numa linha em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/pt/projetos/");
  const a = page.locator(`[data-projects-outro] a[href^="mailto:"]`);
  const box = await a.boundingBox();
  expect(box?.height ?? 99).toBeLessThan(48);
});
