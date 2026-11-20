import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, test } from "vitest";
import { findPending } from "../../scripts/check-release.mjs";

const created: string[] = [];
afterEach(() => {
  for (const d of created.splice(0)) rmSync(d, { recursive: true, force: true });
});

function tmpWith(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "check-release-"));
  created.push(dir);
  for (const [name, content] of Object.entries(files)) {
    const path = join(dir, name);
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, content);
  }
  return dir;
}

test("acha [PENDENTE] em HTML, inclusive em subpastas", () => {
  const dir = tmpWith({ "pt/index.html": "<p>[PENDENTE] frase</p>", "en/index.html": "<p>ok</p>" });
  const found = findPending(dir);
  expect(found).toHaveLength(1);
  expect(found[0]).toMatch(/pt[\\/]index\.html$/);
});

test("acha [PENDENTE] no payload RSC (.txt)", () => {
  expect(findPending(tmpWith({ "pt/index.txt": '{"t":"[PENDENTE] x"}' }))).toHaveLength(1);
});

test("build limpo não acusa nada", () => {
  expect(findPending(tmpWith({ "pt/index.html": "<p>ok</p>", "_next/a.js": "x" }))).toEqual([]);
});
