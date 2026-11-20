import { expect, test, type Page } from "@playwright/test";

// Redesign Abissal — abertura (spec §5.1, insp. Obelisk). Q1 = (a): h1 é o nome, acima do título.

const L = {
  pt: {
    title: ["Engenharia de Computação.", "software ⇄ hardware."],
    telemetry: [
      ["Formação", "Eng. de Computação · UNIFEI"],
      ["Liderança", "Diretor de Projetos · Asimov Jr. (~30 devs)"],
      ["Status", "Aberto a estágio"],
    ],
    status: /UNIFEI.*estágio/,
    cta: "Ver projetos",
  },
  en: {
    title: ["Computer Engineering.", "software ⇄ hardware."],
    telemetry: [
      ["Education", "B.Sc. Computer Engineering · UNIFEI"],
      ["Leadership", "Director of Projects · Asimov Jr. (~30 devs)"],
      ["Status", "Open to internships"],
    ],
    status: /UNIFEI.*internship/,
    cta: "See projects",
  },
} as const;

/** Espera a abertura assentar: medidas em repouso, não no meio de uma animação de escala. */
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

/** Inteiro dentro da tela (os quatro lados), já em repouso. */
async function inFirstFold(page: Page, selector: string) {
  await settled(page);
  const vp = page.viewportSize();
  for (const el of await page.locator(selector).all()) {
    const box = await el.boundingBox();
    expect(box, selector).not.toBeNull();
    expect(box?.x ?? -1, selector).toBeGreaterThanOrEqual(0);
    expect(box?.y ?? -1, selector).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0), selector).toBeLessThanOrEqual(vp?.width ?? 0);
    expect((box?.y ?? 0) + (box?.height ?? 0), selector).toBeLessThanOrEqual(vp?.height ?? 0);
  }
}

/** Nenhum item da telemetria encosta na esfera (o retângulo não intersecta o círculo). */
async function telemetryOutsideSphere(page: Page) {
  await settled(page);
  const sphere = await page.locator('[data-opening] [data-orb][data-variant="hero"]').boundingBox();
  expect(sphere).not.toBeNull();
  const cx = (sphere?.x ?? 0) + (sphere?.width ?? 0) / 2;
  const cy = (sphere?.y ?? 0) + (sphere?.height ?? 0) / 2;
  const r = (sphere?.width ?? 0) / 2;
  for (const item of await page.locator("#hero [data-telemetry] li").all()) {
    const b = await item.boundingBox();
    expect(b).not.toBeNull();
    if (!b) continue;
    const nx = Math.max(b.x, Math.min(cx, b.x + b.width));
    const ny = Math.max(b.y, Math.min(cy, b.y + b.height));
    expect(Math.hypot(nx - cx, ny - cy)).toBeGreaterThan(r);
  }
}

for (const locale of ["pt", "en"] as const) {
  const t = L[locale];
  test.describe(`abertura /${locale}/`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`);
    });

    test("h1 é o nome, visível e acima do título", async ({ page }) => {
      const h1 = page.locator("#hero h1");
      await expect(h1).toHaveText("Leonardo Tolêdo");
      await expect(h1).toBeInViewport();
      const name = await h1.boundingBox();
      const title = await page.locator("#hero [data-hero-title]").boundingBox();
      expect((name?.y ?? 0) + (name?.height ?? 0)).toBeLessThanOrEqual(title?.y ?? 0);
    });

    test("título: contexto apagado e a ponte acesa", async ({ page }) => {
      const title = page.locator("#hero [data-hero-title]");
      await expect(title.locator('[data-emphasis="dim"]')).toHaveText(t.title[0]);
      await expect(title.locator('[data-emphasis="lit"]')).toContainText(t.title[1]);
      await inFirstFold(page, "#hero [data-hero-title]");
    });

    test("telemetria com os dados reais do perfil, na primeira dobra", async ({ page }) => {
      const items = page.locator("#hero [data-telemetry] li");
      await expect(items).toHaveCount(3);
      for (const [i, [label, value]] of t.telemetry.entries()) {
        await expect(items.nth(i).locator("dt")).toHaveText(label);
        await expect(items.nth(i).locator("dd")).toHaveText(value);
      }
      await inFirstFold(page, "#hero [data-telemetry] li");
    });

    test("status e botão para /projetos na primeira dobra", async ({ page }) => {
      await expect(page.locator("#hero [data-status]")).toHaveText(t.status);
      const cta = page.locator(`#hero a[href="/${locale}/projetos/"]`);
      await expect(cta).toHaveText(t.cta);
      await inFirstFold(page, "#hero [data-status]");
      await inFirstFold(page, `#hero a[href="/${locale}/projetos/"]`);
    });
  });
}

test("orbe do hero é decorativo e não captura cliques", async ({ page }) => {
  await page.goto("/pt/");
  const orb = page.locator('[data-opening] [data-orb][data-variant="hero"]');
  await expect(orb).toHaveAttribute("aria-hidden", "true");
  await expect(orb).toHaveCSS("pointer-events", "none");
});

test("telemetria fica fora da esfera do orbe (texto nunca sobre o núcleo do halo)", async ({ page }) => {
  await page.goto("/pt/");
  await telemetryOutsideSphere(page);
});

for (const [w, h] of [[1024, 768], [1280, 800]] as const) {
  test(`em ${w}×${h}: telemetria inteira na tela e fora da esfera`, async ({ page, isMobile }) => {
    test.skip(isMobile, "larguras intermediárias, só no projeto desktop");
    await page.setViewportSize({ width: w, height: h });
    for (const locale of ["pt", "en"]) {
      await page.goto(`/${locale}/`);
      await inFirstFold(page, "#hero [data-telemetry] li");
      await telemetryOutsideSphere(page);
    }
  });
}

test("sem botão de CV enquanto não houver PDF sem telefone", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page.locator("#hero").getByRole("link", { name: /currículo|résumé|cv/i })).toHaveCount(0);
  await expect(page.locator('#hero a[href$=".pdf"]')).toHaveCount(0);
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("nome, título, telemetria, status e botão visíveis", async ({ page }) => {
    await page.goto("/pt/");
    for (const sel of ["#hero h1", "#hero [data-hero-title]", "#hero [data-status]", '#hero a[href="/pt/projetos/"]']) {
      await expect(page.locator(sel), sel).toBeVisible();
    }
    // No desktop os itens ficam em volta do orbe (absolutos) e a lista em si não tem tamanho.
    for (const item of await page.locator("#hero [data-telemetry] li").all()) await expect(item).toBeVisible();
  });
});

test("reduzir movimento: abertura sem animação", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pt/");
  for (const sel of ["#hero [data-telemetry] li", "#hero [data-hero-title]", "#hero [data-hero-cta]", '[data-opening] [data-orb][data-variant="hero"]']) {
    expect(await page.locator(sel).first().evaluate((el) => getComputedStyle(el).animationName), sel).toBe("none");
  }
});
