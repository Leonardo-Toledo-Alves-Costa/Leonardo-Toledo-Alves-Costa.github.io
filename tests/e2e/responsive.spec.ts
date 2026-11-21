import { expect, test } from "@playwright/test";

// Redesign Abissal — home sem rolagem lateral e com alvos de toque ≥ 44px (Review Focus 4).

const WIDTHS = [320, 390, 768, 1024, 1440] as const;

for (const width of WIDTHS) {
  test.describe(`home em ${width}px`, () => {
    test.use({ viewport: { width, height: width < 768 ? 800 : 900 } });

    test("sem rolagem lateral (PT e EN)", async ({ page }) => {
      for (const locale of ["pt", "en"]) {
        await page.goto(`/${locale}/`);
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow, locale).toBeLessThanOrEqual(0);
      }
    });

    test("todo link e botão visível tem alvo ≥ 44×44 (PT e EN)", async ({
      page,
    }) => {
      for (const locale of ["pt", "en"]) {
        await page.goto(`/${locale}/`);
        const small = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>("a, button")]
            .filter((el) => {
              const s = getComputedStyle(el);
              const r = el.getBoundingClientRect();
              // Visível de verdade (não o "pular para o conteúdo" escondido nem o menu fechado).
              return (
                s.visibility !== "hidden" &&
                s.display !== "none" &&
                r.width > 1 &&
                r.height > 1 &&
                !el.closest("[inert], [hidden]")
              );
            })
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(
              ({ r }) => Math.round(r.width) < 44 || Math.round(r.height) < 44,
            )
            .map(
              ({ el, r }) =>
                `${el.tagName} "${(el.textContent ?? "").trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`,
            ),
        );
        expect(small, locale).toEqual([]);
      }
    });
  });
}

test("o letreiro do Sobre não invade o Destaque em 768, 1023 e 1024px", async ({
  page,
}) => {
  for (const width of [768, 1023, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/pt/");
    await page.locator("#highlight").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const { backdropBottom, aboutBottom } = await page.evaluate(() => ({
      backdropBottom: document
        .querySelector("#about [data-backdrop]")!
        .getBoundingClientRect().bottom,
      aboutBottom: document.querySelector("#about")!.getBoundingClientRect()
        .bottom,
    }));
    // Ou a seção recorta, ou o letreiro termina dentro dela.
    const clipped = await page
      .locator("#about")
      .evaluate((e) => getComputedStyle(e).overflowY === "clip");
    expect(clipped || backdropBottom <= aboutBottom, `${width}px`).toBe(true);
  }
});

test("luz de fundo numa camada fixa atrás de tudo (sem background-attachment: fixed)", async ({
  page,
}) => {
  await page.goto("/pt/");
  const bg = await page.evaluate(() => {
    const before = getComputedStyle(document.body, "::before");
    return {
      attachment: getComputedStyle(document.body).backgroundAttachment,
      position: before.position,
      z: Number(before.zIndex),
      image: before.backgroundImage,
    };
  });
  expect(bg.attachment).not.toContain("fixed");
  expect(bg.position).toBe("fixed");
  expect(bg.z).toBeLessThan(-10);
  expect(bg.image).toMatch(/radial-gradient/);
});

test("celular: links do menu aberto também têm alvo ≥ 44px de altura", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pt/");
  await page.getByTestId("menu-toggle").click();
  for (const a of await page.locator("#menu-mobile a").all()) {
    const box = await a.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
  }
});
