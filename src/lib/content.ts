import type { Localized, Project, Skill, SkillCategory, TimelineEntry } from "@/content/types";
import type { Locale } from "@/i18n/config";

export const skillCategories: readonly SkillCategory[] = ["software", "cloud", "engineering", "hardware-ai"];

/** Agrupa por categoria, sempre com as 4 chaves (na ordem de exibição). */
export function skillsByCategory(skills: readonly Skill[]): Record<SkillCategory, Skill[]> {
  const grouped = Object.fromEntries(skillCategories.map((c) => [c, [] as Skill[]])) as Record<SkillCategory, Skill[]>;
  for (const skill of skills) grouped[skill.category].push(skill);
  return grouped;
}

/** Completa a lista com `null` ("slot livre") até `minSlots`; nunca corta projetos. */
export function projectSlots(projects: readonly Project[], minSlots = 3): (Project | null)[] {
  const slots: (Project | null)[] = [...projects];
  while (slots.length < minSlots) slots.push(null);
  return slots;
}

const MONTHS: Record<Locale, readonly string[]> = {
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const PRESENT: Record<Locale, string> = { pt: "atual", en: "Present" };

function formatMonth(yyyyMm: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})$/.exec(yyyyMm);
  const name = match ? MONTHS[locale][Number(match[2]) - 1] : undefined;
  if (!match || !name) throw new RangeError(`data inválida (esperado YYYY-MM): ${yyyyMm}`);
  return `${name} ${match[1]}`;
}

/** "jan 2026 — atual" / "Apr 2025 — Dec 2025" */
export function formatPeriod(entry: Pick<TimelineEntry, "start" | "end">, locale: Locale): string {
  const end = entry.end ? formatMonth(entry.end, locale) : PRESENT[locale];
  return `${formatMonth(entry.start, locale)} — ${end}`;
}

/** Resolve um texto que pode ser único ou bilíngue. */
export function localize(text: string | Localized, locale: Locale): string {
  return typeof text === "string" ? text : text[locale];
}

/** "Eng. de Computação · UNIFEI" → { main, sub }; sem " · ", só { main }. */
export function splitSpec(text: string): { main: string; sub?: string } {
  const at = text.lastIndexOf(" · ");
  return at < 0 ? { main: text } : { main: text.slice(0, at), sub: text.slice(at + 3) };
}
