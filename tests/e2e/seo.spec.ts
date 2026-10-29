import { expect, test } from "@playwright/test";

const SITE = "https://leonardo-toledo-alves-costa.github.io";

for (const [locale, title, desc] of [
  ["pt", /Leonardo Tolêdo — Engenharia de Computação/, /Portfólio de Leonardo Tolêdo/],
  ["en", /Leonardo Tolêdo — Computer Engineering/, /Portfolio of Leonardo Tolêdo/],
] as const) {
  test(`title e description em /${locale}/`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", desc);
  });

  test(`hreflang pt-BR, en e x-default absolutos e canonical em /${locale}/`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute("href", `${SITE}/pt/`);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", `${SITE}/en/`);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", `${SITE}/pt/`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}/${locale}/`);
  });

  test(`Open Graph e Twitter card em /${locale}/`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${SITE}/og.png`);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", locale === "pt" ? "pt_BR" : "en_US");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `${SITE}/${locale}/`);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    // Texto alternativo da imagem também no card do X, não só no Open Graph.
    await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Leonardo Tolêdo");
  });
}

test("imagem de compartilhamento existe e é PNG 1200×630", async ({ request }) => {
  const res = await request.get("/og.png");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
  const buf = await res.body();
  // Cabeçalho IHDR do PNG: largura e altura em big-endian nos bytes 16–23.
  expect(buf.readUInt32BE(16)).toBe(1200);
  expect(buf.readUInt32BE(20)).toBe(630);
});

test("favicon próprio (não o padrão do Next)", async ({ page, request }) => {
  await page.goto("/pt/");
  const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(href).toMatch(/icon/);
  const res = await request.get(href!);
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("LT_");
});

test("design-system tem noindex (PT e EN)", async ({ page }) => {
  for (const path of ["/pt/design-system/", "/en/design-system/"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});

test("sitemap.xml lista /pt/ e /en/ e não lista design-system", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain(`<loc>${SITE}/pt/</loc>`);
  expect(xml).toContain(`<loc>${SITE}/en/</loc>`);
  expect(xml).not.toContain("design-system");
});

test("robots.txt permite indexar e aponta o sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toMatch(/Allow: \//);
  expect(txt).toContain(`Sitemap: ${SITE}/sitemap.xml`);
});

test("rota inexistente serve 404 estilizada com links PT/EN", async ({ page }) => {
  const res = await page.goto("/rota-que-nao-existe/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("404");
  await expect(page.locator('a[href="/pt/"]')).toBeVisible();
  await expect(page.locator('a[href="/en/"]')).toBeVisible();
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(0, 0, 0)");
  // Exatamente um meta robots (o Next injeta noindex na 404; não duplicar).
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("página raiz (redirecionamento) não é indexada", async ({ request }) => {
  // Lê o HTML servido (o navegador redirecionaria antes de dar para inspecionar o DOM).
  const html = await (await request.get("/")).text();
  expect(html).toMatch(/<meta name="robots" content="noindex/);
});
