export type OrbRenderer = "shader" | "css";
export type OrbEnv = { webgl: boolean; reducedMotion: boolean; saveData: boolean };

/** Shader só quando há WebGL e o visitante não pediu menos movimento nem economia de dados (spec §4.3). */
export function chooseOrbRenderer(env: OrbEnv): OrbRenderer {
  return env.webgl && !env.reducedMotion && !env.saveData ? "shader" : "css";
}

type FpsGuardOptions = { minFps: number; windowMs: number; onFail: () => void };

/**
 * Mede a taxa de quadros em janelas de `windowMs`. Se uma janela completa ficar abaixo de `minFps`,
 * chama `onFail` uma única vez (o orbe volta para CSS). `reset` descarta a janela atual.
 */
export function createFpsGuard({ minFps, windowMs, onFail }: FpsGuardOptions) {
  let start: number | null = null;
  let frames = 0;
  let failed = false;
  return {
    tick(now: number) {
      if (failed) return;
      if (start === null) {
        start = now;
        frames = 0;
        return;
      }
      frames += 1;
      const elapsed = now - start;
      if (elapsed < windowMs) return;
      if ((frames * 1000) / elapsed < minFps) {
        failed = true;
        onFail();
        return;
      }
      start = now;
      frames = 0;
    },
    reset() {
      start = null;
      frames = 0;
    },
  };
}

/** Lê o ambiente do navegador (só no cliente). */
export function detectOrbEnv(): OrbEnv {
  let webgl = false;
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    webgl = gl !== null;
    // Só um teste: devolve o contexto ao navegador (há limite de contextos ativos).
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webgl = false;
  }
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return {
    webgl,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: connection?.saveData === true,
  };
}

/**
 * Modo congelado (screenshots e testes): `html[data-orb-frozen]` ou `window.__orbFrozen`.
 * A flag global existe porque a hidratação do React reescreve os atributos do <html> e apaga o
 * atributo posto antes do carregamento; o shader o recoloca depois (para o CSS também valer).
 */
export function isOrbFrozen(
  html: Pick<Element, "hasAttribute"> = document.documentElement,
  scope: { __orbFrozen?: boolean } = window as Window & { __orbFrozen?: boolean },
): boolean {
  return html.hasAttribute("data-orb-frozen") || scope.__orbFrozen === true;
}
