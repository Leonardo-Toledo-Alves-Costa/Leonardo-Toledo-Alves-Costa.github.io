import { expect, test } from "@playwright/test";
import { learning } from "../../src/content/learning";
import { profile } from "../../src/content/profile";
import { en } from "../../src/i18n/dictionaries/en";
import { pt } from "../../src/i18n/dictionaries/pt";
import { splitEmphasis } from "../../src/lib/emphasis";
import { findPhones } from "../../src/lib/privacy";

// Redesign Abissal — Agora estudando (§5.6) e Contato (§5.7).

const plain = (text: string) => splitEmphasis(text).map((s) => s.text).join("");

test.describe("agora estudando", () => {
  for (const locale of ["pt", "en"] as const) {
    test(`/${locale}/: um cartão de vidro por estudo, com tópico (h3) e porquê`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      const items = page.locator("#learning [data-learning]");
      await expect(items).toHaveCount(learning.length);
      for (const [i, l] of learning.entries()) {
        await expect(items.nth(i).locator("h3")).toHaveText(l.topic[locale]);
        await expect(items.nth(i)).toContainText(l.why[locale]);
        expect(await items.nth(i).evaluate((e) => getComputedStyle(e).backdropFilter)).toMatch(/blur/);
      }
    });
  }

  test("mini-orbe em CSS (sem shader) junto do estudo", async ({ page }) => {
    await page.goto("/pt/");
    const orb = page.locator('#learning [data-orb][data-variant="mini"]');
    await expect(orb).toHaveCount(1);
    await expect(orb).toHaveAttribute("aria-hidden", "true");
    await expect(orb.locator("canvas")).toHaveCount(0);
  });
});

test.describe("contato", () => {
  for (const locale of ["pt", "en"] as const) {
    test(`/${locale}/: frase F3 em serifa e mini-orbe ao fundo`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      const statement = page.locator("#contact [data-statement]");
      await expect(statement).toHaveText(plain((locale === "pt" ? pt : en).statements.f3));
      expect(await statement.evaluate((e) => getComputedStyle(e).fontFamily)).toMatch(/Instrument Serif/);
      await expect(page.locator('#contact [data-orb][data-variant="mini"]')).toHaveCount(1);
      const dict = locale === "pt" ? pt : en;
      await expect(page.locator("#contact")).toContainText(dict.contact.intro);
      await expect(page.getByTestId("copy-email")).toHaveText(dict.contact.copy);
    });
  }

  test("copiar e-mail coloca o endereço na área de transferência e confirma", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "permissões de clipboard");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/pt/#contact");
    const button = page.getByTestId("copy-email");
    await button.click();
    await expect(button).toContainText("copiado");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email);
  });

  test("sempre há um link mailto (funciona sem clipboard e sem JS)", async ({ page }) => {
    await page.goto("/pt/#contact");
    await expect(page.locator(`#contact a[href="mailto:${profile.email}"]`)).toHaveCount(1);
  });

  test("LinkedIn e GitHub como botões de contorno, com rel seguro", async ({ page }) => {
    await page.goto("/pt/#contact");
    for (const href of [profile.links.linkedin, profile.links.github]) {
      const a = page.locator(`#contact a[href="${href}"]`);
      await expect(a).toHaveCount(1);
      await expect(a).toHaveAttribute("rel", /noopener/);
      await expect(a).toHaveAttribute("data-variant", "ghost");
    }
  });

  test("contato não exibe telefone", async ({ page }) => {
    await page.goto("/pt/#contact");
    expect(findPhones((await page.locator("#contact").textContent()) ?? "")).toEqual([]);
  });

  test("sem PDF de currículo, nenhum link de currículo", async ({ page }) => {
    test.skip(profile.cv !== undefined, "só vale enquanto não houver CV sem telefone");
    await page.goto("/pt/#contact");
    await expect(page.locator("#contact a[download]")).toHaveCount(0);
  });

  test.describe("sem JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test("e-mail continua acessível como link e o botão de copiar (que exige JS) some", async ({ page }) => {
      await page.goto("/pt/#contact");
      await expect(page.locator(`#contact a[href="mailto:${profile.email}"]`)).toBeVisible();
      await expect(page.getByTestId("copy-email")).toBeHidden();
      await expect(page.locator("#contact [data-statement]")).toBeVisible();
    });
  });
});

test("copiar e-mail sem permissão de clipboard não finge sucesso", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("negado")) } });
  });
  await page.goto("/pt/#contact");
  await page.getByTestId("copy-email").click();
  await page.waitForTimeout(300);
  await expect(page.getByTestId("copy-email")).not.toContainText("copiado");
});

test("links do contato quebram em separadores, não no meio da palavra", async ({ page }) => {
  await page.goto("/pt/#contact");
  for (const a of await page.locator("#contact a").all()) {
    await expect(a).not.toHaveCSS("word-break", "break-all");
  }
});

test("só um canvas na página: o do orbe da abertura", async ({ page }) => {
  await page.goto("/pt/");
  await page.waitForLoadState("load");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  expect(await page.locator("canvas").count()).toBeLessThanOrEqual(1);
  expect(await page.locator("#learning canvas, #contact canvas").count()).toBe(0);
});
