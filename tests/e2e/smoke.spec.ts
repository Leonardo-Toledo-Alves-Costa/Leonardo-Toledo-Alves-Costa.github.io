import { expect, test } from "@playwright/test";

const SECTIONS = ["hero", "about", "stack", "timeline", "projects", "learning", "contact"];

for (const locale of ["pt", "en"] as const) {
  test.describe(`/${locale}/`, () => {
    test("7 seções presentes na ordem", async ({ page }) => {
      await page.goto(`/${locale}/`);
      const ids = await page.locator("main > section[id]").evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(SECTIONS);
    });

    test("sem erros de console", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/${locale}/`);
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });

    test("sem rolagem horizontal", async ({ page }) => {
      await page.goto(`/${locale}/`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test("link 'pular para o conteúdo' é o primeiro foco", async ({ page }) => {
      await page.goto(`/${locale}/`);
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).toHaveAttribute("href", "#conteudo");
    });

    test("rodapé com ano e link do código", async ({ page }) => {
      await page.goto(`/${locale}/`);
      // O rodapé da página é o único com papel contentinfo (os <footer> dos cards não contam).
      const footer = page.getByRole("contentinfo");
      await expect(footer).toContainText(String(new Date().getFullYear()));
      await expect(footer.locator('a[href*="github.com/Leonardo-Toledo-Alves-Costa"]')).toHaveCount(1);
    });
  });
}

test("troca de idioma mantém a página", async ({ page }) => {
  await page.goto("/pt/");
  await page.getByTestId("locale-switch").first().click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("troca de idioma preserva a âncora", async ({ page }) => {
  await page.goto("/pt/#stack");
  await page.getByTestId("locale-switch").first().click();
  await expect(page).toHaveURL(/\/en\/#stack$/);
  await expect(page.locator("#stack")).toBeInViewport();
});

test("seletor de idioma anuncia o idioma de destino", async ({ page }) => {
  await page.goto("/en/");
  const sw = page.getByTestId("locale-switch").first();
  await expect(sw).toHaveAttribute("hreflang", "pt-BR");
  await expect(sw).toHaveAttribute("lang", "pt-BR");
});

test("nav desktop: âncora leva à seção e marca a ativa", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular a nav é um menu");
  await page.goto("/pt/");
  await page.locator('nav a[href="#stack"]').first().click();
  await expect(page.locator("#stack")).toBeInViewport();
  await expect(page.locator('nav a[href="#stack"]').first()).toHaveAttribute("aria-current", "true");
});

test("mobile: menu abre e fecha por teclado e devolve o foco", async ({ page, isMobile }) => {
  test.skip(!isMobile, "só no celular");
  await page.goto("/pt/");
  const toggle = page.getByTestId("menu-toggle");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const menu = page.locator("#menu-mobile");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("mobile: escolher um item do menu fecha o menu e rola até a seção", async ({ page, isMobile }) => {
  test.skip(!isMobile, "só no celular");
  await page.goto("/pt/");
  await page.getByTestId("menu-toggle").click();
  await page.locator('#menu-mobile a[href="#projects"]').click();
  await expect(page.locator("#menu-mobile")).toBeHidden();
  await expect(page.locator("#projects")).toBeInViewport();
});

test("mobile: a nav não quebra linha (pílula compacta)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "só no celular");
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/pt/");
  const nav = page.getByTestId("site-nav");
  const box = await nav.boundingBox();
  expect(box?.height ?? 999).toBeLessThanOrEqual(56);
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("todas as seções têm título visível", async ({ page }) => {
    await page.goto("/pt/");
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id} :is(h1, h2)`).first(), id).toBeVisible();
    }
  });
});

test("mobile: menu aberto vira painel (cantos não recortam o conteúdo)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "só no celular");
  await page.goto("/pt/");
  await page.getByTestId("menu-toggle").click();
  const radius = await page.getByTestId("site-nav").evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(radius).toBeLessThanOrEqual(24);
});

test("controles da barra da nav têm alvo de toque ≥ 44px", async ({ page, isMobile }) => {
  await page.goto("/pt/");
  const nav = page.getByTestId("site-nav");
  const controls = [nav.locator('a[href="#hero"]'), page.getByTestId("locale-switch").first()];
  if (isMobile) controls.push(page.getByTestId("menu-toggle"));
  for (const c of controls) {
    const box = await c.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test("desktop: item ativo fica verde mesmo com o mouse em cima, e sai ao voltar ao topo", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular a nav é um menu");
  await page.goto("/pt/");
  const stack = page.locator('nav a[href="#stack"]').first();
  await stack.click();
  await expect(stack).toHaveAttribute("aria-current", "true");
  await stack.hover();
  await expect(stack).toHaveCSS("color", "rgb(124, 255, 107)");
  await page.getByTestId("site-nav").locator('a[href="#hero"]').click();
  await expect(page.locator("nav a[aria-current]")).toHaveCount(0);
});

test("seletor de idioma não usa o verde (reservado ao ativo e ao logo)", async ({ page }) => {
  await page.goto("/pt/");
  await expect(page.getByTestId("locale-switch").first()).not.toHaveCSS("color", "rgb(124, 255, 107)");
});

test("mobile: a nav tem a mesma largura aberta e fechada", async ({ page, isMobile }) => {
  test.skip(!isMobile, "só no celular");
  await page.goto("/pt/");
  const nav = page.getByTestId("site-nav");
  const closed = (await nav.boundingBox())?.width;
  await page.getByTestId("menu-toggle").click();
  const opened = (await nav.boundingBox())?.width;
  expect(opened).toBe(closed);
});

test("troca de idioma de /en/ para /pt/", async ({ page }) => {
  await page.goto("/en/");
  await page.getByTestId("locale-switch").first().click();
  await expect(page).toHaveURL(/\/pt\/$/);
});

test.describe("sem JavaScript: seletor de idioma funciona", () => {
  test.use({ javaScriptEnabled: false });
  for (const [from, to] of [["pt", "en"], ["en", "pt"]] as const) {
    test(`/${from}/ → /${to}/`, async ({ page }) => {
      await page.goto(`/${from}/`);
      await page.getByTestId("locale-switch").first().click();
      await expect(page).toHaveURL(new RegExp(`/${to}/$`));
    });
  }
});

test("anel de foco dos controles da nav fica dentro do vidro (não é cortado)", async ({ page }) => {
  await page.goto("/pt/");
  const logo = page.getByTestId("site-nav").locator('a[href="#hero"]');
  await logo.focus();
  const offset = await logo.evaluate((el) => parseFloat(getComputedStyle(el).outlineOffset));
  expect(offset).toBeLessThan(0);
});

test("títulos das seções não repetem o rótulo de serigrafia", async ({ page }) => {
  await page.goto("/pt/");
  for (const id of ["about", "stack", "timeline", "projects", "learning", "contact"]) {
    const label = (await page.locator(`#${id} .silkscreen`).first().textContent())?.replace(/^\d+ · /, "").trim().toLowerCase();
    const title = (await page.locator(`#${id} h2`).first().textContent())?.trim().toLowerCase();
    expect(title, id).not.toBe(label);
  }
});

test("nome acessível do logo e da troca de idioma contém o texto visível (WCAG 2.5.3)", async ({ page }) => {
  await page.goto("/pt/");
  const nav = page.getByTestId("site-nav");
  for (const el of [nav.locator('a[href="#hero"]'), page.getByTestId("locale-switch").first()]) {
    const { visible, label } = await el.evaluate((e) => ({ visible: (e.textContent ?? "").replace(/[^\p{L}\p{N}]/gu, ""), label: e.getAttribute("aria-label") ?? "" }));
    expect(visible.length).toBeGreaterThan(0);
    expect(label.replace(/[^\p{L}\p{N}]/gu, "")).toContain(visible);
  }
});

test("sem rolagem lateral em larguras intermediárias (tablet e notebook pequeno)", async ({ page, isMobile }) => {
  test.skip(isMobile, "percorre as larguras num só projeto");
  for (const width of [320, 640, 768, 1024, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/pt/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `largura ${width}`).toBeLessThanOrEqual(0);
  }
});
