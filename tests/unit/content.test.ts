import { expect, test } from "vitest";
import { learning } from "@/content/learning";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { timeline } from "@/content/timeline";
import type { Project, TimelineEntry } from "@/content/types";
import { formatPeriod, localize, projectSlots, skillsByCategory } from "@/lib/content";

const p1 = { id: "p1" } as Project;
const p2 = { id: "p2" } as Project;
const p3 = { id: "p3" } as Project;
const p4 = { id: "p4" } as Project;

test("skillsByCategory retorna as 4 categorias, mesmo vazias", () => {
  expect(Object.keys(skillsByCategory([]))).toEqual(["software", "cloud", "engineering", "hardware-ai"]);
});

test("skillsByCategory agrupa cada skill na sua categoria", () => {
  const grouped = skillsByCategory(skills);
  expect(grouped.software.map((s) => s.id)).toContain("flutter");
  expect(grouped["hardware-ai"].map((s) => s.id)).toContain("robotics");
  expect(Object.values(grouped).flat()).toHaveLength(skills.length);
});

test("projectSlots completa com null", () => {
  expect(projectSlots([p1], 3)).toEqual([p1, null, null]);
});

test("projectSlots não corta quando há mais projetos que slots", () => {
  expect(projectSlots([p1, p2, p3, p4], 3)).toHaveLength(4);
});

test("formatPeriod em português e inglês", () => {
  expect(formatPeriod({ start: "2026-01" } as TimelineEntry, "pt")).toBe("jan 2026 — atual");
  expect(formatPeriod({ start: "2025-04", end: "2025-12" } as TimelineEntry, "en")).toBe("Apr 2025 — Dec 2025");
  expect(formatPeriod({ start: "2024-11", end: "2025-02" } as TimelineEntry, "pt")).toBe("nov 2024 — fev 2025");
  expect(formatPeriod({ start: "2026-04" } as TimelineEntry, "en")).toBe("Apr 2026 — Present");
});

// Percorre qualquer valor e devolve todos os objetos { pt, en } encontrados.
function localizedIn(value: unknown): { pt: unknown; en: unknown }[] {
  if (Array.isArray(value)) return value.flatMap(localizedIn);
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 2 && keys.includes("pt") && keys.includes("en")) return [value as { pt: unknown; en: unknown }];
    return Object.values(value).flatMap(localizedIn);
  }
  return [];
}

test("todo texto bilíngue do conteúdo tem pt e en não vazios", () => {
  const all = localizedIn([profile, skills, timeline, projects, learning]);
  expect(all.length).toBeGreaterThan(20);
  for (const l of all) {
    expect(typeof l.pt === "string" && l.pt.trim().length > 0).toBe(true);
    expect(typeof l.en === "string" && l.en.trim().length > 0).toBe(true);
  }
});

test("projetos só referenciam skills existentes", () => {
  const ids = new Set(skills.map((s) => s.id));
  for (const p of projects) for (const s of p.skills) expect(ids.has(s), `${p.id} → ${s}`).toBe(true);
});

test("ids únicos em cada coleção", () => {
  for (const list of [skills, timeline, projects, learning]) {
    const ids = list.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
});

test("learning.progress, quando existe, fica entre 0 e 100", () => {
  for (const l of learning) {
    if (l.progress === undefined) continue;
    expect(l.progress).toBeGreaterThanOrEqual(0);
    expect(l.progress).toBeLessThanOrEqual(100);
  }
});

test("datas da trajetória no formato YYYY-MM", () => {
  for (const t of timeline) {
    expect(t.start).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
    if (t.end) expect(t.end).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
  }
});

test("conteúdo do currículo: 4 projetos, prêmio no ArborizAI, CV ainda indefinido", () => {
  expect(projects.map((p) => p.id)).toEqual(["arborizai", "dip-mobile", "softcare-mobile", "teccurar-infra"]);
  expect(projects.find((p) => p.id === "arborizai")?.award?.pt).toMatch(/JEWC/);
  expect(profile.cv).toBeUndefined();
  expect(profile.specs).toHaveLength(4);
});

test("localize aceita texto único ou bilíngue", () => {
  expect(localize("Docker", "en")).toBe("Docker");
  expect(localize({ pt: "Robótica", en: "Robotics" }, "en")).toBe("Robotics");
});

test("trajetória em ordem decrescente de início", () => {
  const starts = timeline.map((t) => t.start);
  expect(starts).toEqual([...starts].sort().reverse());
});

test("formatPeriod rejeita data inválida", () => {
  expect(() => formatPeriod({ start: "2026-13" }, "pt")).toThrow(RangeError);
  expect(() => formatPeriod({ start: "abc" }, "en")).toThrow(RangeError);
});

test("stacks confirmadas pelo Leonardo nos projetos", () => {
  const stack = (id: string) => projects.find((p) => p.id === id)?.skills ?? [];
  expect(stack("dip-mobile")).toEqual(expect.arrayContaining(["flutter", "riverpod", "firebase"]));
  expect(stack("softcare-mobile")).toEqual(expect.arrayContaining(["flutter", "riverpod"]));
  expect(stack("arborizai")).toEqual(expect.arrayContaining(["webgis", "lidar"]));
});

test("estudo atual: C e C++ para lógica e estruturas de dados", () => {
  expect(learning[0]?.id).toBe("c-cpp");
  expect(learning[0]?.why.pt).toMatch(/estruturas de dados/);
});

test("bancos de dados usados na Asimov aparecem na stack", () => {
  const ids = skills.map((s) => s.id);
  expect(ids).toEqual(expect.arrayContaining(["mongodb", "supabase", "firebase", "riverpod"]));
});
