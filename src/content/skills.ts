import type { Skill } from "./types";

// Fonte: currículos (out/2026). Interesses de hardware/IA/XR entram como "learning", sem inflar domínio.
// TODO(conteúdo): confirmar com o Leonardo o nível de cada tecnologia.
export const skills: Skill[] = [
  // software
  { id: "c", name: "C", category: "software", level: "used" },
  { id: "cpp", name: "C++", category: "software", level: "used" },
  { id: "python", name: "Python", category: "software", level: "used" },
  { id: "flutter", name: "Dart / Flutter", category: "software", level: "proficient" },
  { id: "typescript", name: "TypeScript", category: "software", level: "used" },
  { id: "javascript", name: "JavaScript", category: "software", level: "used" },
  // cloud / devops
  { id: "gcp", name: "Google Cloud", category: "cloud", level: "used" },
  { id: "docker", name: "Docker", category: "cloud", level: "used" },
  { id: "firebase", name: "Firebase", category: "cloud", level: "used" },
  { id: "linux", name: "Linux", category: "cloud", level: "used" },
  { id: "traefik", name: "Traefik", category: "cloud", level: "used" },
  { id: "git", name: "Git / GitHub", category: "cloud", level: "proficient" },
  // engenharia e métodos
  { id: "oop", name: { pt: "POO", en: "OOP" }, category: "engineering", level: "used" },
  { id: "dsa", name: { pt: "Estruturas de dados e algoritmos", en: "Data structures & algorithms" }, category: "engineering", level: "used" },
  { id: "scrum", name: "Scrum", category: "engineering", level: "proficient" },
  { id: "kanban", name: "Kanban", category: "engineering", level: "used" },
  { id: "notion", name: "Notion", category: "engineering", level: "used" },
  // hardware · IA · XR (interesses em estudo)
  { id: "robotics", name: { pt: "Robótica", en: "Robotics" }, category: "hardware-ai", level: "learning" },
  { id: "automation", name: { pt: "Automação", en: "Automation" }, category: "hardware-ai", level: "learning" },
  { id: "ai-vision", name: { pt: "IA / Visão computacional", en: "AI / Computer vision" }, category: "hardware-ai", level: "learning" },
  { id: "xr", name: { pt: "Realidade virtual", en: "Virtual reality" }, category: "hardware-ai", level: "learning" },
];
