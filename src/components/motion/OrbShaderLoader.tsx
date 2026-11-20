"use client";

import type { MotionValue } from "motion/react";
import { type ComponentType, useEffect, useState } from "react";
import { chooseOrbRenderer, detectOrbEnv } from "@/lib/orb-capability";

type ShaderProps = { expand?: MotionValue<number> };

/**
 * Carrega o shader do orbe só depois do primeiro desenho (load + ocioso), num chunk separado,
 * e só se o ambiente permitir (WebGL, sem reduzir movimento, sem economia de dados).
 * Até lá — e para sempre, se não der — vale a camada CSS do <Orb>.
 */
export function OrbShaderLoader({ expand }: ShaderProps) {
  const [Shader, setShader] = useState<ComponentType<ShaderProps> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    const load = () => {
      if (cancelled || chooseOrbRenderer(detectOrbEnv()) !== "shader") return;
      void import("./OrbShader").then((m) => {
        if (!cancelled) setShader(() => m.OrbShader);
      });
    };
    const whenIdle = () => {
      idleId = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(load, { timeout: 2000 }) : window.setTimeout(load, 200);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
      if (idleId !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
        else window.clearTimeout(idleId);
      }
    };
  }, []);

  return Shader ? <Shader expand={expand} /> : null;
}
