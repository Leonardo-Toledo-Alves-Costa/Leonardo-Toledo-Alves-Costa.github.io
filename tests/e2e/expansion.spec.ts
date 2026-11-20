import { expect, test, type Page } from "@playwright/test";

// Redesign Abissal — expansão do orbe ("eclipse") com a frase F1 (spec §5.2).

const orb = '[data-orb][data-variant="hero"]';
const statement = "[data-expansion] [data-statement]";

/** Espera a abertura assentar (animações finitas da camada do orbe e do hero). */
async function settled(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      (document.querySelector("[data-opening]")?.getAnimations({ subtree: true }) ?? [])
        // Só animações de tempo (as guiadas por rolagem, ScrollTimeline, nunca "terminam").
        .filter((a) => a.timeline === document.timeline && a.effect?.getComputedTiming().endTime !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
}

/** Rola até uma fração do palco da expansão (0 = topo do palco no topo da tela, 1 = fim). */
async function scrollStage(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const stage = document.querySelector<HTMLElement>("[data-expansion]");
    if (!stage) throw new Error("sem palco");
    const top = stage.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (stage.offsetHeight - window.innerHeight) * f, behavior: "instant" });
  }, fraction);
}

const width = (page: Page) => page.locator(orb).evaluate((el) => el.getBoundingClientRect().width);
/** Opacidade efetiva do bloco da frase (o wrapper animado é o pai). */
const statementOpacity = (page: Page) => page.locator(statement).evaluate((el) => Number(getComputedStyle(el.parentElement ?? el).opacity));
/** Opacidade do contêiner animado do orbe (o pai do <Orb>). */
const orbOpacity = (page: Page) => page.locator(orb).evaluate((el) => Number(getComputedStyle(el.parentElement ?? el).opacity));

for (const locale of ["pt", "en"] as const) {
  test(`/${locale}/: no topo, orbe em repouso e frase ainda escondida`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await settled(page);
    expect(await statementOpacity(page)).toBeLessThan(0.1);
    expect(await orbOpacity(page)).toBe(1);
  });

  test(`/${locale}/: no meio do palco, eclipse com a frase F1 legível`, async ({ page, isMobile }) => {
    await page.goto(`/${locale}/`);
    await settled(page);
    const rest = await width(page);
    expect(rest).toBeGreaterThan(100);
    await scrollStage(page, 0.5);
    await expect(page.locator(statement)).toBeInViewport();
    await expect.poll(() => statementOpacity(page)).toBeGreaterThan(0.5);
    // Desktop cresce ~4× no total; o celular, mais estreito, ~2,4× (a borda acesa fica à vista).
    await expect.poll(async () => (await width(page)) / rest).toBeGreaterThan(isMobile ? 1.6 : 3);
    // O orbe não começa a sumir enquanto a frase está em leitura.
    expect(await orbOpacity(page)).toBeGreaterThanOrEqual(0.95);
    await expect(page.locator(statement)).toContainText("F1");
  });
}

test("sem WebGL, a camada CSS também escurece e perde o grão na expansão", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    // @ts-expect-error -- sobrescrita de teste: nega só o WebGL
    HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
      return String(type).includes("webgl") ? null : original.call(this, type as "2d", ...(rest as []));
    };
  });
  await page.goto("/pt/");
  await settled(page);
  const style = () =>
    page.locator(orb).evaluate((el) => ({
      filter: getComputedStyle(el.querySelector("[data-orb-sphere]") as Element).filter,
      grain: Number(getComputedStyle(el.querySelector(".orb-grain") as Element).opacity),
    }));
  const atRest = await style();
  expect(atRest.grain).toBeCloseTo(0.22, 2);
  await scrollStage(page, 0.5);
  await expect.poll(async () => (await style()).grain).toBeLessThan(0.1);
  expect((await style()).filter).toMatch(/brightness\(0\.[0-5]/);
});

test.describe("reduzir movimento", () => {
  test.use({ reducedMotion: "reduce" });
  test("frase visível e orbe sem escala, sem palco alto", async ({ page }) => {
    await page.goto("/pt/");
    const rest = await width(page);
    await page.locator(statement).scrollIntoViewIfNeeded();
    expect(await statementOpacity(page)).toBe(1);
    expect(Math.abs((await width(page)) - rest)).toBeLessThan(1);
    const stage = await page.locator("[data-expansion]").boundingBox();
    expect(stage?.height ?? 9999).toBeLessThanOrEqual((page.viewportSize()?.height ?? 0) * 1.05);
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("frase visível e orbe em repouso", async ({ page }) => {
    await page.goto("/pt/");
    await page.locator(statement).scrollIntoViewIfNeeded();
    await expect(page.locator(statement)).toBeVisible();
    expect(await statementOpacity(page)).toBe(1);
    const box = await page.locator(orb).boundingBox();
    expect(box?.width ?? 0).toBeLessThan((page.viewportSize()?.width ?? 0) * 0.7);
  });
});
