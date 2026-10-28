import type { Skill } from "./types";

// Fonte: currículos (out/2026) + confirmações do Leonardo (27/10/2026: Riverpod e bancos usados na Asimov; WebGIS e LiDAR no ArborizAI).
// Níveis: proposta mantida pelo Leonardo por enquanto. Em hardware-ai, o que já foi aplicado em projeto é "used" (LiDAR) e os interesses em estudo são "learning", sem inflar domínio.
export const skills: Skill[] = [
  // software
  { id: "c", name: "C", category: "software", level: "used" },
  { id: "cpp", name: "C++", category: "software", level: "used" },
  { id: "python", name: "Python", category: "software", level: "used" },
  { id: "flutter", name: "Dart / Flutter", category: "software", level: "proficient" },
  { id: "riverpod", name: "Riverpod", category: "software", level: "used" },
  { id: "webgis", name: "WebGIS", category: "software", level: "used" },
  { id: "typescript", name: "TypeScript", category: "software", level: "used" },
  { id: "javascript", name: "JavaScript", category: "software", level: "used" },
  // cloud / devops
  { id: "gcp", name: "Google Cloud", category: "cloud", level: "used" },
  { id: "docker", name: "Docker", category: "cloud", level: "used" },
  { id: "firebase", name: "Firebase", category: "cloud", level: "used" },
  { id: "supabase", name: "Supabase", category: "cloud", level: "used" },
  { id: "mongodb", name: "MongoDB", category: "cloud", level: "used" },
  { id: "linux", name: "Linux", category: "cloud", level: "used" },
  { id: "traefik", name: "Traefik", category: "cloud", level: "used" },
  { id: "git", name: "Git / GitHub", category: "cloud", level: "proficient" },
  // engenharia e métodos
  { id: "oop", name: { pt: "POO", en: "OOP" }, category: "engineering", level: "used" },
  { id: "dsa", name: { pt: "Estruturas de dados e algoritmos", en: "Data structures & algorithms" }, category: "engineering", level: "used" },
  { id: "scrum", name: "Scrum", category: "engineering", level: "proficient" },
  { id: "kanban", name: "Kanban", category: "engineering", level: "used" },
  { id: "notion", name: "Notion", category: "engineering", level: "used" },
  // hardware · IA · XR (aplicado em projeto + interesses em estudo)
  { id: "lidar", name: "LiDAR (iOS)", category: "hardware-ai", level: "used" },
  { id: "robotics", name: { pt: "Robótica", en: "Robotics" }, category: "hardware-ai", level: "learning" },
  { id: "automation", name: { pt: "Automação", en: "Automation" }, category: "hardware-ai", level: "learning" },
  { id: "ai-vision", name: { pt: "IA / Visão computacional", en: "AI / Computer vision" }, category: "hardware-ai", level: "learning" },
  { id: "xr", name: { pt: "Realidade virtual", en: "Virtual reality" }, category: "hardware-ai", level: "learning" },
];
