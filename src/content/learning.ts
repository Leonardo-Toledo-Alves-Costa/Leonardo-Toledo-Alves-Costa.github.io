import type { LearningItem } from "./types";

// Interesses declarados pelo Leonardo (robótica, automação, IA, realidade virtual), ligados à meta hardware ⇄ software.
// TODO(conteúdo): confirmar o que está estudando agora e, se quiser, o progresso de cada item.
export const learning: LearningItem[] = [
  {
    id: "robotics",
    topic: { pt: "Robótica", en: "Robotics" },
    why: {
      pt: "Onde o software encontra o mundo físico — o centro da ponte hardware ⇄ software.",
      en: "Where software meets the physical world — the core of the hardware ⇄ software bridge.",
    },
  },
  {
    id: "automation",
    topic: { pt: "Automação", en: "Automation" },
    why: {
      pt: "Sistemas que sentem, decidem e agem sozinhos.",
      en: "Systems that sense, decide and act on their own.",
    },
  },
  {
    id: "ai-vision",
    topic: { pt: "IA e visão computacional", en: "AI & computer vision" },
    why: {
      pt: "Dar percepção às máquinas — base para robótica e realidade virtual.",
      en: "Giving machines perception — a foundation for robotics and virtual reality.",
    },
  },
  {
    id: "xr",
    topic: { pt: "Realidade virtual", en: "Virtual reality" },
    why: {
      pt: "Interfaces imersivas que unem IA, gráficos e hardware.",
      en: "Immersive interfaces that bring together AI, graphics and hardware.",
    },
  },
];
