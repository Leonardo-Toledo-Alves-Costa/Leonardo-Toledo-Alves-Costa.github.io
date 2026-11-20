"use client";

import type { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createFpsGuard, isOrbFrozen } from "@/lib/orb-capability";
import { ORB_FRAGMENT, ORB_VERTEX } from "./orb-shader.glsl";

const MAX_DPR = 1.5;
const MOBILE_SCALE = 0.5;
const INTRO_SECONDS = 1.4;
const FROZEN_TIME = 4;
const TOKENS = ["bg-abyss", "bg-deep", "bg-glow", "accent", "accent-hi"] as const;
const UNIFORM_FOR: Record<(typeof TOKENS)[number], string> = {
  "bg-abyss": "uAbyss",
  "bg-deep": "uDeep",
  "bg-glow": "uGlow",
  accent: "uAccent",
  "accent-hi": "uHi",
};

/** "#rrggbb" → [r, g, b] em 0..1; null se o token não estiver no formato esperado. */
function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m?.[1]) return null;
  const v = parseInt(m[1], 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

/**
 * Camada WebGL do orbe (carregada sob demanda pelo OrbShaderLoader). Desenha por cima da camada CSS
 * e, em qualquer problema (contexto perdido, shader que não compila, fps baixo), some e devolve o
 * orbe para CSS. Leveza: DPR ≤ 1.5, meia resolução no celular, pausa fora da tela e com a aba oculta.
 */
export function OrbShader({ expand }: { expand?: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = canvas?.closest<HTMLElement>("[data-orb]");
    if (!canvas || !root) return;
    const frozen = isOrbFrozen();
    // A hidratação apaga o atributo posto antes do carregamento: recoloca para o CSS do congelado valer.
    if (frozen) document.documentElement.setAttribute("data-orb-frozen", "");
    // Congelado (screenshots e testes): aparece sem transição e com um quadro fixo.
    if (frozen) canvas.style.transition = "none";
    let raf = 0;
    let running = false;
    let visible = true;
    let disposed = false;

    const fallback = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      root.dataset.renderer = "css";
      setAlive(false);
    };

    // Congelado: preserva o buffer para o quadro fixo não sumir entre composições (screenshots idênticos).
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power", preserveDrawingBuffer: frozen });
    if (!gl) return fallback();

    const styles = getComputedStyle(document.documentElement);
    const colors = TOKENS.map((t) => hexToRgb(styles.getPropertyValue(`--color-${t}`)));
    if (colors.some((c) => c === null)) return fallback();

    const vs = compile(gl, gl.VERTEX_SHADER, ORB_VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, ORB_FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return fallback();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fallback();
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    TOKENS.forEach((t, i) => {
      const c = colors[i];
      if (c) gl.uniform3fv(u(UNIFORM_FOR[t]), c);
    });
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uIntro = u("uIntro");
    const uExpand = u("uExpand");

    const resize = () => {
      const scale = window.innerWidth < 768 ? MOBILE_SCALE : 1;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * scale;
      const box = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(box.width * dpr));
      canvas.height = Math.max(1, Math.round(box.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const guard = createFpsGuard({ minFps: 40, windowMs: 2000, onFail: fallback });
    const start = performance.now();
    let shown = false;

    const draw = (now: number) => {
      const seconds = frozen ? FROZEN_TIME : (now - start) / 1000;
      const intro = frozen ? 1 : Math.min(1, seconds / INTRO_SECONDS);
      gl.uniform1f(uTime, seconds);
      gl.uniform1f(uIntro, 1 - (1 - intro) ** 3);
      gl.uniform1f(uExpand, expand?.get() ?? 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        root.dataset.renderer = "shader";
        canvas.style.opacity = "1";
      }
    };

    const frame = (now: number) => {
      if (disposed) return;
      draw(now);
      guard.tick(now);
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (frozen || disposed || running || !visible || document.hidden) return;
      running = true;
      guard.reset();
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onLost = (e: Event) => {
      e.preventDefault();
      fallback();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (frozen) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) play();
      else pause();
    });
    io.observe(root);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    // Congelado não tem loop: redesenha quando a expansão muda (a escala por transform não dispara resize).
    const unsubscribeExpand = frozen ? expand?.on("change", () => !disposed && draw(performance.now())) : undefined;

    resize();
    if (frozen) draw(performance.now());
    else play();

    return () => {
      disposed = true;
      pause();
      unsubscribeExpand?.();
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (!gl.isContextLost()) {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
      root.dataset.renderer = "css";
    };
  }, [expand]);

  if (!alive) return null;
  return (
    <canvas
      ref={canvasRef}
      data-orb-canvas=""
      className="absolute inset-0 size-full rounded-full opacity-0 transition-opacity duration-700 ease-abissal"
    />
  );
}
