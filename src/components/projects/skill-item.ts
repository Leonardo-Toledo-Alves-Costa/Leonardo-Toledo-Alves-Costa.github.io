import type { SkillLevel } from "@/content/types";

export type SkillItem = { id: string; name: string; level: SkillLevel; projects: string[] };

/**
 * Onde o painel abre no palco: em cima/embaixo da pílula e para que lado cresce (para fora da elipse,
 * longe da frase). "flow" = o painel não fica junto da pílula; quem renderiza é o bloco (SkillPanel).
 */
export type PanelPlacement = { v: "up" | "down"; h: "start" | "center" | "end" } | "flow";

export const panelId = (skillId: string) => `skill-panel-${skillId}`;
