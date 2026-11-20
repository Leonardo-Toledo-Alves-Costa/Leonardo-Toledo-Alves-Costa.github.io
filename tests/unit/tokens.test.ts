import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { contrastRatio } from "@/lib/contrast";
import { THEME_COLOR } from "@/lib/site";

const css = readFileSync(join(process.cwd(), "src/styles/globals.css"), "utf8");
const theme = css.slice(css.indexOf("@theme"), css.indexOf("}", css.indexOf("@theme")));

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

describe("tokens Abissal (spec §4.1)", () => {
  const expected: Record<string, string> = {
    "--color-bg-abyss": "#02050c",
    "--color-bg-deep": "#06122a",
    "--color-bg-glow": "#0e2a5a",
    "--color-accent": "#2f7bff",
    "--color-accent-hi": "#9cc4ff",
    "--color-ink": "#eef3fa",
    "--color-ink-dim": "#8897b3",
    "--color-line": "rgb(255 255 255 / 0.14)",
    "--color-glass": "rgb(14 30 60 / 0.35)",
    "--ease-abissal": "cubic-bezier(0.2, 0.7, 0.2, 1)",
  };

  for (const [name, value] of Object.entries(expected)) {
    test(`${name} = ${value}`, () => {
      const match = theme.match(new RegExp(`${name}:\\s*([^;]+);`));
      expect(match?.[1]?.trim().toLowerCase()).toBe(value);
    });
  }

  test("fonte serifada exposta como token", () => {
    expect(theme).toMatch(/--font-serif:\s*var\(--font-instrument-serif\)/);
  });

  test("sem verde nem tokens da linha Silicon em src/", () => {
    for (const file of filesUnder(join(process.cwd(), "src"))) {
      const text = readFileSync(file, "utf8").toLowerCase();
      expect(text, file).not.toContain("7cff6b");
      expect(text, file).not.toContain("124 255 107");
      expect(text, file).not.toMatch(/--color-(signal|led-off|led-dim|surface-1|surface-2|text-2)\b/);
      expect(text, file).not.toMatch(/\b(text|bg|border|stroke|fill|outline|decoration|ring)-(signal|led-off|led-dim|surface-1|surface-2|text-2)\b/);
      expect(text, file).not.toMatch(/--color-(bg|text)(?![-\w])/);
      expect(text, file).not.toMatch(/\b(text|bg|border|stroke|fill|outline|decoration|ring)-(bg|text)(?![-\w])/);
      expect(text, file).not.toMatch(/\bease-out-ui\b/);
      // Classe de cor que não existe no tema (ex.: renomeação encadeada "bg-bg-abyss-deep").
      expect(text, file).not.toMatch(/-(bg-abyss|ink-dim|accent-hi)-(deep|glow|abyss|dim|hi)\b/);
    }
  });
});

describe("contraste (WCAG AA)", () => {
  test("ink-dim passa AA sobre os três fundos", () => {
    expect(contrastRatio("#8897B3", "#0E2A5A")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#8897B3", "#06122A")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#8897B3", "#02050C")).toBeGreaterThanOrEqual(4.5);
  });

  test("referência conhecida: branco sobre preto = 21", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 5);
  });

  test("hex fora do formato #RRGGBB é erro, não NaN", () => {
    expect(() => contrastRatio("#fff", "#000000")).toThrow("hex inválido");
    expect(() => contrastRatio("rgb(0 0 0)", "#000000")).toThrow("hex inválido");
  });

  test("o cinza do protótipo (#7D8BA3) reprova sobre bg-glow", () => {
    expect(contrastRatio("#7D8BA3", "#0E2A5A")).toBeLessThan(4.5);
  });
});

test("THEME_COLOR é o abyss", () => {
  expect(THEME_COLOR).toBe("#02050C");
});
