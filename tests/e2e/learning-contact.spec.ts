import { expect, test } from "@playwright/test";
import { learning } from "../../src/content/learning";
import { findPhones } from "../../src/lib/privacy";

test.describe("agora compilando", () => {
  test("um item por estudo, com tópico e porquê", async ({ page }) => {
    await page.goto("/pt/#learning");
    const items = page.locator("#learning [data-learning]");
    await expect(items).toHaveCount(learning.length);
    for (const [i, l] of learning.entries()) {
      await expect(items.nth(i)).toContainText(l.topic.pt);
      await expect(items.nth(i)).toContainText(l.why.pt);
    }
  });

  test("barra de progresso só para itens com progresso; os demais mostram 'compilando'", async ({ page }) => {
    await page.goto("/pt/#learning");
    await expect(page.locator('#learning [role="progressbar"]')).toHaveCount(learning.filter((l) => l.progress !== undefined).length);
    const noProgress = page.locator("#learning [data-learning]:not(:has([role=progressbar]))");
    for (const item of await noProgress.all()) await expect(item).toContainText("compilando");
  });

  test("inglês: status traduzido", async ({ page }) => {
    await page.goto("/en/#learning");
    await expect(page.locator("#learning [data-learning]").first()).toContainText("compiling");
  });
});

test.describe("contato", () => {
  test("copiar e-mail coloca o endereço na área de transferência e confirma", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "permissões de clipboard");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/pt/#contact");
    const button = page.getByTestId("copy-email");
    await button.click();
    await expect(button).toContainText("copiado");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("ltoledo.alves@gmail.com");
  });

  test("sempre há um link mailto (funciona sem clipboard e sem JS)", async ({ page }) => {
    await page.goto("/pt/#contact");
    await expect(page.locator('#contact a[href="mailto:ltoledo.alves@gmail.com"]')).toHaveCount(1);
  });

  test("LinkedIn e GitHub com rel seguro", async ({ page }) => {
    await page.goto("/pt/#contact");
    for (const href of ["https://linkedin.com/in/leonardotac", "https://github.com/Leonardo-Toledo-Alves-Costa"]) {
      const a = page.locator(`#contact a[href="${href}"]`);
      await expect(a).toHaveCount(1);
      await expect(a).toHaveAttribute("rel", /noopener/);
    }
  });

  test("contato não exibe telefone", async ({ page }) => {
    await page.goto("/pt/#contact");
    expect(findPhones((await page.locator("#contact").textContent()) ?? "")).toEqual([]);
  });

  test("bloco de terminal com o comando de conexão", async ({ page }) => {
    await page.goto("/en/#contact");
    await expect(page.locator("#contact")).toContainText("connect --to leonardo");
    await expect(page.getByTestId("copy-email")).toContainText("copy");
  });

  test.describe("sem JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test("e-mail continua acessível como link e o botão de copiar (que exige JS) some", async ({ page }) => {
      await page.goto("/pt/#contact");
      await expect(page.locator('#contact a[href="mailto:ltoledo.alves@gmail.com"]')).toBeVisible();
      await expect(page.getByTestId("copy-email")).toBeHidden();
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

test("com 'reduzir movimento' o ponto de 'compilando' não pulsa", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pt/#learning");
  const name = await page.locator("#learning [data-pulse-dot]").first().evaluate((e) => getComputedStyle(e).animationName);
  expect(name).toBe("none");
});

test("tópico de estudo é um título (h3)", async ({ page }) => {
  await page.goto("/pt/#learning");
  await expect(page.locator("#learning [data-learning] h3")).toHaveCount(learning.length);
});

test("links do contato quebram em separadores, não no meio da palavra", async ({ page }) => {
  await page.goto("/pt/#contact");
  for (const a of await page.locator("#contact a").all()) {
    await expect(a).not.toHaveCSS("word-break", "break-all");
  }
});

test("contato usa o Terminal do design system e entra com Reveal", async ({ page }) => {
  await page.goto("/pt/#contact");
  await expect(page.locator("#contact [data-terminal]")).toHaveCount(1);
  await expect(page.locator("#contact [data-reveal] [data-terminal]")).toHaveCount(1);
});
