// Gera public/og.png (1200×630) fotografando a abertura (hero com o orbe congelado) do build estático.
// Uso: npm run og  (faz o build antes). A imagem acompanha o design em vez de ser um arquivo feito à mão.
import { execSync, spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { chromium } from "@playwright/test";

const PORT = 4199;
const server = spawn("npx", ["serve", "out", "-l", String(PORT), "--config", "../serve.json"], {
  shell: true,
  stdio: "ignore",
  // Fora do Windows: grupo de processos próprio, para encerrar o shell e o serve juntos.
  detached: process.platform !== "win32",
});

/** `kill` simples derruba só o shell; o `serve` filho ficaria segurando a porta. Encerra a árvore inteira. */
function stopServer() {
  if (process.platform === "win32" && server.pid) {
    try {
      execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" });
    } catch {}
  } else if (server.pid) {
    try {
      process.kill(-server.pid);
    } catch {}
  }
}

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(`http://localhost:${PORT}/pt/`)).ok) return;
    } catch {}
    await wait(250);
  }
  throw new Error(`servidor não respondeu em http://localhost:${PORT}/pt/ (rodou o build?)`);
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  try {
    // 1600×840 a 0,75× = 1200×630: a prévia sai no layout largo (telemetria em volta do orbe, ≥ 1280px).
    const page = await browser.newPage({ viewport: { width: 1600, height: 840 }, deviceScaleFactor: 0.75 });
    // Orbe congelado (tempo fixo): a imagem não depende do instante da captura.
    await page.addInitScript(() => Object.assign(window, { __orbFrozen: true }));
    await page.goto(`http://localhost:${PORT}/pt/`, { waitUntil: "load" });
    // Sem a nav fixa nem o "role ↓": a imagem é a abertura (orbe, telemetria, nome, headline).
    await page.addStyleTag({ content: "body > header,[data-scroll-hint]{display:none!important}" });
    // Shader assume após o load + ocioso; sem WebGL no ambiente, fica a camada CSS (também vale).
    await page
      .waitForSelector('#hero [data-orb][data-renderer="shader"], [data-opening] [data-orb][data-renderer="shader"]', { timeout: 8000 })
      .catch(() => console.warn("shader não assumiu: og.png com o orbe em CSS"));
    // Espera a abertura assentar (só animações de tempo finitas; as de rolagem nunca terminam).
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a.timeline === document.timeline && a.effect?.getComputedTiming().endTime !== Infinity)
          .map((a) => a.finished.catch(() => undefined)),
      ),
    );
    await page.waitForTimeout(800);
    await page.screenshot({ path: "public/og.png" });
    console.log("public/og.png gerado (1200×630)");
  } finally {
    await browser.close();
  }
} finally {
  stopServer();
}
