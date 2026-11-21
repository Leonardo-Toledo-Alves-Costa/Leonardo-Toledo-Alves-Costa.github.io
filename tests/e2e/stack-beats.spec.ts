import { expect, test, type Page } from "@playwright/test";
import { projects } from "../../src/content/projects";
import { skills } from "../../src/content/skills";
import { pt } from "../../src/i18n/dictionaries/pt";
import { localize } from "../../src/lib/content";
import { splitEmphasis } from "../../src/lib/emphasis";

// Redesign Abissal — stack em 4 batidas em /projetos (spec §6.2 item 2, insp. Superconscious).

const BEATS = ["software", "cloud", "engineering", "hardware-ai"] as const;
const used = (id: string) => projects.some((p) => p.skills.includes(id));

/** Rola até o meio da batida `i` (progresso do palco = (i + 0,5) / 4). */
async function toBeat(page: Page, i: number) {
  // Só depois da hidratação o palco vira animado (antes é o layout estático, bem mais alto).
  await page.locator('[data-beat][data-state="active"]').first().waitFor({ state: "attached" });
  await page.evaluate((beat) => {
    const stage = document.querySelector<HTMLElement>("[data-stack-stage]");
    if (!stage) throw new Error("sem palco");
    const top = stage.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (stage.offsetHeight - innerHeight) * ((beat + 0.5) / 4), behavior: "instant" });
  }, i);
  await expect(page.locator(`[data-beat="${BEATS[i]}"]`)).toHaveAttribute("data-state", "active");
  // Espera a batida assentar (transição de 700 ms + escalonamento das pílulas).
  await page.waitForTimeout(1100);
}

const inertOf = (page: Page) =>
  page.locator("[data-beat]").evaluateAll((els) => Object.fromEntries(els.map((e) => [e.getAttribute("data-beat"), (e as HTMLElement).inert])));

test("26 pílulas: com projeto são botões, sem projeto são texto", async ({ page }) => {
  await page.goto("/pt/projetos/");
  await expect(page.locator("[data-skill]")).toHaveCount(skills.length);
  for (const skill of skills) {
    const pill = page.locator(`[data-skill="${skill.id}"]`);
    expect(await pill.evaluate((e) => e.tagName), skill.id).toBe(used(skill.id) ? "BUTTON" : "SPAN");
  }
  for (const id of ["c", "cpp", "python"]) expect(await page.locator(`[data-skill="${id}"]`).evaluate((e) => e.tagName)).toBe("SPAN");
});

test("pílula-botão abre o painel com os projetos que usam a skill", async ({ page, isMobile }) => {
  await page.goto("/pt/projetos/", { waitUntil: "networkidle" });
  if (isMobile) await page.locator('[data-skill="docker"]').scrollIntoViewIfNeeded();
  else await toBeat(page, 1);
  const docker = page.locator('[data-skill="docker"]');
  await expect(docker).toHaveAttribute("aria-expanded", "false");
  await docker.click();
  await expect(docker).toHaveAttribute("aria-expanded", "true");
  const panel = page.locator(`#${await docker.getAttribute("aria-controls")}`);
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("Infra Moodle/TecCurar");
  await expect(panel.locator("li")).toHaveText(["Infra Moodle/TecCurar"]);
  await page.keyboard.press("Escape");
  await expect(docker).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await expect(docker).toBeFocused();
  // Clique fora também fecha.
  await docker.click();
  await expect(panel).toBeVisible();
  // Clique fora: na legenda (texto, fora de pílulas e painéis).
  await page.locator("[data-stack-legend]").click();
  await expect(panel).toBeHidden();
});

test("desktop: trocar de batida fecha o painel aberto", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular não há batidas");
  await page.goto("/pt/projetos/");
  await toBeat(page, 1);
  const docker = page.locator('[data-skill="docker"]');
  await docker.click();
  await expect(docker).toHaveAttribute("aria-expanded", "true");
  await toBeat(page, 2);
  await expect(docker).toHaveAttribute("aria-expanded", "false");
});

test("desktop: painel aberto fica por cima das outras pílulas e da legenda, dentro da tela", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular o painel entra no fluxo");
  await page.goto("/pt/projetos/");
  await toBeat(page, 0);
  for (const id of ["flutter", "riverpod", "webgis"]) {
    const pill = page.locator(`[data-skill="${id}"]`);
    await pill.click();
    const panel = page.locator(`#${await pill.getAttribute("aria-controls")}`);
    const box = (await panel.boundingBox())!;
    const vp = page.viewportSize()!;
    expect(box.y, id).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height, id).toBeLessThanOrEqual(vp.height);
    // O ponto do meio do painel pertence ao próprio painel (nada pinta por cima).
    const onTop = await page.evaluate(([x, y, pid]) => !!document.elementFromPoint(x, y)?.closest(`#${pid}`), [box.x + box.width / 2, box.y + box.height / 2, await pill.getAttribute("aria-controls")] as const);
    expect(onTop, id).toBe(true);
    await page.keyboard.press("Escape");
  }
});

test("pílulas com projeto têm pista visual (▾); as de texto não", async ({ page }) => {
  await page.goto("/pt/projetos/");
  await expect(page.locator('[data-skill="docker"] svg')).toHaveCount(1);
  await expect(page.locator('[data-skill="python"] svg')).toHaveCount(0);
});

test("celular: painel entra no fluxo sem rolagem lateral", async ({ page, isMobile }) => {
  test.skip(!isMobile, "regra do celular");
  await page.goto("/pt/projetos/");
  for (const id of ["linux", "docker", "traefik", "firebase"].filter((id) => projects.some((p) => p.skills.includes(id)))) {
    await page.locator(`[data-skill="${id}"]`).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, id).toBeLessThanOrEqual(0);
    await page.keyboard.press("Escape");
  }
});

test("frase F5 fixa ao centro e legenda de níveis em texto", async ({ page }) => {
  await page.goto("/pt/projetos/");
  const f5 = splitEmphasis(pt.statements.f5).map((x) => x.text).join("");
  await expect(page.locator("[data-stack-stage] [data-statement]")).toHaveText(f5);
  const legend = page.locator("[data-stack-legend]");
  for (const label of ["estudando", "usei em projeto", "domino"]) await expect(legend).toContainText(label);
});

test("desktop: só a batida ativa fica fora de inert; a anterior recua", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular não há palco fixo");
  await page.goto("/pt/projetos/");
  await toBeat(page, 1);
  await expect.poll(() => inertOf(page)).toEqual({ software: true, cloud: false, engineering: true, "hardware-ai": true });
  const past = page.locator('[data-beat="software"]');
  await expect(past).toHaveAttribute("data-state", "past");
  await expect.poll(() => past.evaluate((e) => Number(getComputedStyle(e).opacity))).toBeLessThan(0.3);
  await toBeat(page, 3);
  await expect.poll(() => inertOf(page)).toEqual({ software: true, cloud: true, engineering: true, "hardware-ai": false });
});

test("desktop: Tab percorre só as pílulas-botão da batida ativa", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular não há palco fixo");
  await page.goto("/pt/projetos/");
  await toBeat(page, 0);
  await expect.poll(() => inertOf(page).then((m) => m.software)).toBe(false);
  await page.locator('[data-beat="software"] button').first().focus();
  const seen = new Set<string>();
  for (let i = 0; i < 12; i++) {
    const id = await page.evaluate(() => document.activeElement?.getAttribute("data-skill") ?? "");
    if (id) seen.add(id);
    await page.keyboard.press("Tab");
  }
  const softwareButtons = skills.filter((s) => s.category === "software" && used(s.id)).map((s) => s.id);
  expect([...seen].sort()).toEqual([...softwareButtons].sort());
});

test("celular: blocos normais (sem palco fixo nem inert)", async ({ page, isMobile }) => {
  test.skip(!isMobile, "regra do celular");
  await page.goto("/pt/projetos/");
  expect(Object.values(await inertOf(page)).some(Boolean)).toBe(false);
  expect(await page.locator("[data-stack-stage] > div").first().evaluate((e) => getComputedStyle(e).position)).not.toBe("sticky");
  for (const beat of BEATS) {
    await page.locator(`[data-beat="${beat}"] h3`).scrollIntoViewIfNeeded();
    await expect(page.locator(`[data-beat="${beat}"] h3`)).toBeVisible();
  }
});

for (const [name, use] of [
  ["sem JavaScript", { javaScriptEnabled: false }],
  ["reduzir movimento", { reducedMotion: "reduce" as const }],
] as const) {
  test.describe(name, () => {
    test.use(use);
    test("nenhuma batida inert e todas as skills visíveis", async ({ page }) => {
      await page.goto("/pt/projetos/");
      for (const beat of BEATS) {
        const el = page.locator(`[data-beat="${beat}"]`);
        expect(await el.evaluate((e) => (e as HTMLElement).inert)).toBe(false);
      }
      for (const skill of skills) {
        await expect(page.locator(`[data-skill="${skill.id}"]`), skill.id).toBeVisible();
        await expect(page.locator(`[data-skill="${skill.id}"]`)).toContainText(localize(skill.name, "pt"));
      }
    });
  });
}

test("desktop: a frase F5 fica fixa no lugar enquanto as batidas passam", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular não há palco fixo");
  await page.goto("/pt/projetos/");
  const f5 = page.locator("[data-stack-stage] [data-statement]");
  await toBeat(page, 0);
  const a = await f5.boundingBox();
  await toBeat(page, 2);
  await page.waitForTimeout(200);
  const b = await f5.boundingBox();
  expect(Math.abs((a?.y ?? 0) - (b?.y ?? 99))).toBeLessThan(2);
});

test("celular: abrir o painel não mexe nas pílulas da linha", async ({ page, isMobile }) => {
  test.skip(!isMobile, "regra do celular");
  await page.goto("/pt/projetos/");
  const mongo = page.locator('[data-skill="mongodb"]');
  await mongo.scrollIntoViewIfNeeded();
  // Posição no documento (o toque pode rolar a página; isso não conta como "mexer").
  const pos = () => mongo.evaluate((e) => { const r = e.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY }; });
  const before = await pos();
  await page.locator('[data-skill="linux"]').click();
  await expect(page.locator('[data-skill="linux"]')).toHaveAttribute("aria-expanded", "true");
  const after = await pos();
  expect(Math.abs(before.x - after.x)).toBeLessThan(1);
  expect(Math.abs(before.y - after.y)).toBeLessThan(1);
});

test("desktop: as camadas das batidas não roubam o clique (só as pílulas recebem)", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular não há palco fixo");
  await page.goto("/pt/projetos/");
  await toBeat(page, 1);
  for (const beat of await page.locator("[data-beat]").all()) {
    expect(await beat.evaluate((e) => getComputedStyle(e).pointerEvents)).toBe("none");
  }
  const docker = page.locator('[data-skill="docker"]');
  const box = (await docker.boundingBox())!;
  const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest("[data-skill]")?.getAttribute("data-skill"), [box.x + box.width / 2, box.y + box.height / 2] as const);
  expect(hit).toBe("docker");
});

test("seta da pílula na mesma linha do nome", async ({ page, isMobile }) => {
  await page.goto("/pt/projetos/", { waitUntil: "networkidle" });
  // No desktop o Docker está na batida 1 (cloud); no celular, no bloco normal.
  if (isMobile) await page.locator('[data-skill="docker"]').scrollIntoViewIfNeeded();
  else await toBeat(page, 1);
  const docker = page.locator('[data-skill="docker"]');
  const name = await docker.getByText("Docker", { exact: true }).boundingBox();
  const arrow = await docker.locator("svg").boundingBox();
  if (!name || !arrow) throw new Error("sem caixa do nome ou da seta");
  expect(Math.abs(name.y + name.height / 2 - (arrow.y + arrow.height / 2))).toBeLessThan(4);
  expect(arrow.x).toBeGreaterThan(name.x + name.width - 1);
});

test("celular: tocar dentro do painel aberto não o fecha", async ({ page, isMobile }) => {
  test.skip(!isMobile, "no celular o painel fica abaixo da linha");
  await page.goto("/pt/projetos/", { waitUntil: "networkidle" });
  const docker = page.locator('[data-skill="docker"]');
  await docker.scrollIntoViewIfNeeded();
  await docker.click();
  const panel = page.locator(`#${await docker.getAttribute("aria-controls")}`);
  await panel.locator("li").first().click();
  await expect(panel).toBeVisible();
  await expect(docker).toHaveAttribute("aria-expanded", "true");
});

test("desktop: painel aberto não cobre a frase F5", async ({ page, isMobile }) => {
  test.skip(isMobile, "no celular o painel entra no fluxo");
  await page.goto("/pt/projetos/");
  await toBeat(page, 0);
  const f5 = (await page.locator("[data-stack-stage] [data-statement]").boundingBox())!;
  for (const id of ["flutter", "riverpod", "webgis"]) {
    const pill = page.locator(`[data-skill="${id}"]`);
    await pill.click();
    const p = (await page.locator(`#${await pill.getAttribute("aria-controls")}`).boundingBox())!;
    const overlap = p.x < f5.x + f5.width && p.x + p.width > f5.x && p.y < f5.y + f5.height && p.y + p.height > f5.y;
    expect(overlap, id).toBe(false);
    await page.keyboard.press("Escape");
  }
});
