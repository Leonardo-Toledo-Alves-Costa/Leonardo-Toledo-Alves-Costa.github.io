import { expect, test } from "@playwright/test";

// Redesign Abissal — orbe (spec §4.3). Demonstrado em /design-system até entrar no hero (Task 9).

test.describe("orbe CSS (sem JavaScript)", () => {
  test.use({ javaScriptEnabled: false });

  test("os três tamanhos aparecem, quadrados, em CSS", async ({ page }) => {
    await page.goto("/pt/design-system/");
    for (const variant of ["hero", "mini", "halo"]) {
      const orb = page.getByTestId("ds-orb").locator(`[data-orb][data-variant="${variant}"]`);
      await expect(orb, variant).toBeVisible();
      await expect(orb, variant).toHaveAttribute("data-renderer", "css");
      const box = await orb.boundingBox();
      expect(Math.abs((box?.width ?? 0) - (box?.height ?? 1)), variant).toBeLessThanOrEqual(1);
    }
  });

  test("é decorativo para leitores de tela", async ({ page }) => {
    await page.goto("/pt/design-system/");
    await expect(page.getByTestId("ds-orb").locator("[data-orb]").first()).toHaveAttribute("aria-hidden", "true");
  });

  test("esfera tem luz (gradiente) e halo cobalto", async ({ page }) => {
    await page.goto("/pt/design-system/");
    const orb = page.getByTestId("ds-orb").locator('[data-orb][data-variant="hero"]');
    const sphere = await orb.locator("[data-orb-sphere]").evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(sphere).toMatch(/radial-gradient/);
    const halo = await orb.locator("[data-orb-halo]").evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(halo).toMatch(/radial-gradient/);
    await expect(orb.locator("[data-orb-canvas-slot]")).toHaveCount(1);
  });

  test("a variante halo tem a esfera mais apagada que a hero (quase só luz)", async ({ page }) => {
    await page.goto("/pt/design-system/");
    const opacity = (v: string) =>
      page.getByTestId("ds-orb").locator(`[data-orb][data-variant="${v}"] [data-orb-sphere]`).evaluate((el) => getComputedStyle(el).opacity);
    expect(await opacity("hero")).toBe("1");
    expect(await opacity("halo")).toBe("0.6");
  });
});


// ---- Task 8: shader WebGL por cima da camada CSS ----
/** Espera o carregamento + duas voltas da fila ociosa: o loader do shader já teria decidido. */
async function idle(page: import("@playwright/test").Page) {
  await page.waitForLoadState("load");
  for (let i = 0; i < 2; i++) {
    await page.evaluate(
      () => new Promise<void>((r) => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(() => r(), { timeout: 2500 }) : setTimeout(r, 300))),
    );
  }
}

test.describe("orbe com shader", () => {
  test.skip(({ isMobile }) => isMobile, "o comportamento do shader é o mesmo; roda só no desktop");
  const hero = '[data-testid="ds-orb"] [data-orb][data-variant="hero"]';

  test("com WebGL vira shader depois do carregamento", async ({ page }) => {
    await page.goto("/pt/design-system/");
    await expect(page.locator(hero)).toHaveAttribute("data-renderer", "shader", { timeout: 5000 });
    await expect(page.locator(`${hero} canvas`)).toHaveCount(1);
  });

  test("o mini fica sempre em CSS (sem canvas)", async ({ page }) => {
    await page.goto("/pt/design-system/");
    await expect(page.locator(hero)).toHaveAttribute("data-renderer", "shader", { timeout: 5000 });
    await expect(page.locator('[data-testid="ds-orb"] [data-orb][data-variant="mini"] canvas')).toHaveCount(0);
  });

  test("reduzir movimento fica em CSS, sem canvas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/pt/design-system/");
    await idle(page);
    await expect(page.locator(hero)).toHaveAttribute("data-renderer", "css");
    await expect(page.locator(`${hero} canvas`)).toHaveCount(0);
  });

  test("sem WebGL fica em CSS", async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      // @ts-expect-error -- sobrescrita de teste: nega só o WebGL
      HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
        return String(type).includes("webgl") ? null : original.call(this, type as "2d", ...(rest as []));
      };
    });
    await page.goto("/pt/design-system/");
    await idle(page);
    await expect(page.locator(hero)).toHaveAttribute("data-renderer", "css");
    await expect(page.locator(`${hero} canvas`)).toHaveCount(0);
  });

  test("contexto perdido volta para CSS sem erro no console", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/pt/design-system/");
    await expect(page.locator(hero)).toHaveAttribute("data-renderer", "shader", { timeout: 5000 });
    await page.locator(`${hero} canvas`).evaluate((c) => {
      (c as HTMLCanvasElement).getContext("webgl")?.getExtension("WEBGL_lose_context")?.loseContext();
    });
    await expect(page.locator(hero)).toHaveAttribute("data-renderer", "css");
    await expect(page.locator(`${hero} canvas`)).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("resolução do canvas limitada a 1,5× mesmo em tela 3×", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    await page.goto("/pt/design-system/");
    await expect(page.locator(hero)).toHaveAttribute("data-renderer", "shader", { timeout: 5000 });
    const { width, box } = await page.locator(`${hero} canvas`).evaluate((c) => ({
      width: (c as HTMLCanvasElement).width,
      box: c.getBoundingClientRect().width,
    }));
    expect(width).toBeLessThanOrEqual(Math.ceil(box * 1.5) + 1);
    // Abaixo de 768px o shader renderiza em meia resolução (o orbe é difuso; a perda não aparece).
    await page.setViewportSize({ width: 390, height: 844 });
    await expect
      .poll(() => page.locator(`${hero} canvas`).evaluate((c) => (c as HTMLCanvasElement).width / c.getBoundingClientRect().width))
      .toBeLessThanOrEqual(0.75 + 0.02);
    await ctx.close();
  });

  test("modo congelado gera quadros idênticos (screenshots estáveis)", async ({ page }) => {
    await page.addInitScript(() => Object.assign(window, { __orbFrozen: true }));
    await page.goto("/pt/design-system/");
    const orb = page.locator(hero);
    await expect(orb).toHaveAttribute("data-renderer", "shader", { timeout: 5000 });
    // Compara o quadro do próprio canvas (o screenshot da página varia alguns níveis por causa da
    // composição da GPU, mesmo sem nada mudar — medido: sem shader, o screenshot é idêntico).
    // O modo congelado precisa estar valendo de verdade (a hidratação apagava o atributo).
    expect(await page.evaluate(() => document.documentElement.hasAttribute("data-orb-frozen"))).toBe(true);
    const frame = () => page.locator(`${hero} canvas`).evaluate((c) => (c as HTMLCanvasElement).toDataURL());
    const blank = await page.locator(`${hero} canvas`).evaluate((c) => {
      const empty = document.createElement("canvas");
      empty.width = (c as HTMLCanvasElement).width;
      empty.height = (c as HTMLCanvasElement).height;
      return empty.toDataURL();
    });
    const a = await frame();
    await page.waitForTimeout(600);
    const b = await frame();
    expect(a).not.toBe(blank);
    expect(a === b).toBe(true);
  });
});

test("na variante halo o shader também fica apagado (mesma opacidade da esfera CSS)", async ({ page, isMobile }) => {
  test.skip(isMobile, "só desktop");
  await page.goto("/pt/design-system/");
  const slot = page.locator('[data-testid="ds-orb"] [data-orb][data-variant="halo"] [data-orb-canvas-slot]');
  expect(await slot.evaluate((el) => getComputedStyle(el).opacity)).toBe("0.6");
});

test("com shader ativo, a esfera e o grão CSS saem (o canvas substitui, não soma)", async ({ page, isMobile }) => {
  test.skip(isMobile, "só desktop");
  await page.addInitScript(() => Object.assign(window, { __orbFrozen: true }));
  await page.goto("/pt/design-system/");
  const orb = page.locator('[data-testid="ds-orb"] [data-orb][data-variant="halo"]');
  await expect(orb).toHaveAttribute("data-renderer", "shader", { timeout: 5000 });
  expect(await orb.locator("[data-orb-sphere]").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  expect(await orb.locator(".orb-grain").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  expect(await orb.locator("[data-orb-halo]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
});
