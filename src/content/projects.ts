import type { Project } from "./types";

// Fonte: currículos (out/2026). Projetos de cliente/pesquisa: código privado, sem links; textos só do currículo (decisão do Leonardo).
// Stacks confirmadas pelo Leonardo (27/10/2026): Asimov = Flutter + Riverpod; ArborizAI usa WebGIS e LiDAR do iOS.
export const projects: Project[] = [
  {
    id: "arborizai",
    name: "ArborizAI",
    tagline: { pt: "Mapeamento geoespacial e inventário de árvores", en: "Geospatial tree mapping and inventory" },
    description: {
      pt: "Case incubado na INCIT/UNIFEI: solução tecnológica escalável para inventário e mapeamento geoespacial de árvores.",
      en: "Case incubated at INCIT/UNIFEI: a scalable technology solution for geospatial tree mapping and inventory.",
    },
    skills: ["webgis", "lidar"],
    award: { pt: "Vencedor mundial JEWC/ENEJ — Projeto de Impacto", en: "Global Winner JEWC/ENEJ — Impact Project" },
    visibility: "private",
  },
  {
    id: "dip-mobile",
    name: "DIP Mobile",
    tagline: { pt: "Gestão imobiliária", en: "Real estate management" },
    description: {
      pt: "App em Flutter/Dart integrado a APIs e Firebase: módulo financeiro (contratos, recebíveis e tributos) e fluxo completo de cadastros.",
      en: "Flutter/Dart app integrated with REST APIs and Firebase: financial module (contracts, receivables and taxes) and complete customer workflows.",
    },
    skills: ["flutter", "riverpod", "firebase"],
    visibility: "private",
  },
  {
    id: "softcare-mobile",
    name: "Softcare Mobile",
    tagline: { pt: "Saúde e gestão", en: "Healthcare & management" },
    description: {
      pt: "Fase crítica de depuração, homologação e entrega final; controle de acesso por cargos (RBAC), formulários dinâmicos ligados ao banco e exportação de dashboards em PDF.",
      en: "Critical debugging, QA stabilization and final production delivery; role-based access control (RBAC), dynamic database-driven forms and PDF dashboard export.",
    },
    skills: ["flutter", "riverpod"],
    visibility: "private",
  },
  {
    id: "teccurar-infra",
    name: "Infra Moodle/TecCurar",
    tagline: { pt: "Infraestrutura em nuvem para capacitação clínica", en: "Cloud infrastructure for clinical training" },
    description: {
      pt: "Planejamento, conteinerização e implantação em Google Cloud (Docker, Linux, Traefik) da plataforma de capacitação clínica e apoio à decisão de profissionais de saúde.",
      en: "Designed, containerized and deployed on Google Cloud (Docker, Linux, Traefik) the clinical training and decision-support platform for healthcare professionals.",
    },
    skills: ["gcp", "docker", "linux", "traefik"],
    visibility: "private",
  },
];
