/** Texto nas duas línguas do site. */
export type Localized = { pt: string; en: string };

export type SkillLevel = "learning" | "used" | "proficient";
export type SkillCategory = "software" | "cloud" | "engineering" | "hardware-ai";

export interface Skill {
  id: string;
  /** Texto único quando é igual nas duas línguas (ex.: "Docker"). */
  name: string | Localized;
  category: SkillCategory;
  level: SkillLevel;
  context?: Localized;
}

export interface TimelineEntry {
  id: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM; ausente = atual */
  end?: string;
  role: Localized;
  org: string;
  summary: Localized;
  highlight?: boolean;
}

export interface Project {
  id: string;
  name: string;
  tagline: Localized;
  description: Localized;
  /** ids de Skill */
  skills: string[];
  award?: Localized;
  visibility: "public" | "private";
  links?: { repo?: string; demo?: string };
  image?: string;
}

export interface LearningItem {
  id: string;
  topic: Localized;
  why: Localized;
  /** 0–100; ausente = "explorando", sem barra */
  progress?: number;
}

export interface Profile {
  name: string;
  headline: Localized;
  bio: Localized;
  location: string;
  email: string;
  links: { github: string; linkedin: string };
  /** Só com PDF sem telefone; até lá o botão de CV fica oculto. */
  cv?: { pt?: string; en?: string };
  specs: { label: Localized; value: Localized }[];
  /** Situação atual, mostrada na primeira dobra (nível + o que busca). */
  status: Localized;
  award: Localized;
}
