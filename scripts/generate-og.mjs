// Gera public/og.png (1200×630) fotografando o hero do build estático.
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
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${PORT}/pt/`);
    // Sem a nav fixa e sem o recuo que existe só para ela: a imagem é a assinatura
    // (boot, nome cromado, headline, prêmio) centralizada nos 630px, com margem igual em cima e embaixo
    // (redes sociais sobrepõem selos e cantos na base da prévia).
    await page.addStyleTag({
      content: "body > header{display:none!important} #hero{min-height:630px!important;align-items:center!important;padding-top:0!important;padding-bottom:0!important}",
    });
    await page.waitForSelector('#hero [data-boot][data-state="done"]');
    // As linhas do boot ficam visíveis um instante depois do estado "done" (hidratação).
    await page.waitForFunction(() =>
      [...document.querySelectorAll("#hero [data-boot-line]")].every((el) => getComputedStyle(el).visibility === "visible"),
    );
    await page.screenshot({ path: "public/og.png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log("public/og.png gerado (1200×630)");
  } finally {
    await browser.close();
  }
} finally {
  stopServer();
}
