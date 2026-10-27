import type { TimelineEntry } from "./types";

// Fonte: currículos (out/2026). Ordem: mais recente primeiro.
// O prêmio JEWC/ENEJ não tem data própria no currículo: entra como destaque da diretoria.
export const timeline: TimelineEntry[] = [
  {
    id: "ic-unifei",
    start: "2026-04",
    role: { pt: "Pesquisador de Iniciação Científica", en: "Undergraduate Research Fellow" },
    org: "UNIFEI",
    summary: {
      pt: "Planejamento, conteinerização (Docker) e implantação em Google Cloud da plataforma Moodle/TecCurar, voltada à capacitação clínica e ao apoio à decisão de profissionais de saúde.",
      en: "Designed, containerized (Docker) and deployed on Google Cloud the Moodle/TecCurar platform, supporting clinical training and medical decision-making.",
    },
  },
  {
    id: "asimov-director",
    start: "2026-01",
    role: { pt: "Diretor de Projetos", en: "Director of Projects" },
    org: "Asimov Jr.",
    summary: {
      pt: "Lidera cerca de 30 desenvolvedores em squads Scrum: planejamento de entregas, replanejamento de escopo e prazo e contato direto com clientes. Vencedor mundial do JEWC/ENEJ na categoria Projeto de Impacto com o case ArborizAI.",
      en: "Leads ~30 developers across Scrum squads: delivery planning, scope and timeline replanning, and direct stakeholder communication. Global Winner of JEWC/ENEJ in the Impact Project category with the ArborizAI case.",
    },
    highlight: true,
  },
  {
    id: "asimov-mobile",
    start: "2025-04",
    end: "2025-12",
    role: { pt: "Desenvolvedor Mobile", en: "Mobile Software Developer" },
    org: "Asimov Jr.",
    summary: {
      pt: "Flutter/Dart com APIs e Firebase nos projetos DIP Mobile (módulo financeiro e cadastros) e Softcare Mobile (depuração, homologação e entrega; RBAC, formulários dinâmicos e exportação de dashboards em PDF).",
      en: "Flutter/Dart with REST APIs and Firebase on DIP Mobile (financial module and customer workflows) and Softcare Mobile (debugging, QA and production delivery; RBAC, dynamic forms and PDF dashboard export).",
    },
  },
  {
    id: "unifei",
    // TODO(conteúdo): confirmar mês de ingresso na UNIFEI com o Leonardo.
    start: "2025-03",
    role: {
      pt: "Engenharia de Computação — formatura prevista dez/2029",
      en: "B.Sc. Computer Engineering — expected graduation Dec 2029",
    },
    org: "UNIFEI",
    summary: {
      pt: "Bacharelado em Engenharia de Computação na Universidade Federal de Itajubá.",
      en: "Bachelor of Science in Computer Engineering at the Federal University of Itajubá.",
    },
  },
  {
    id: "ambev",
    start: "2024-11",
    end: "2025-02",
    role: { pt: "Jovem Aprendiz — Logística", en: "Logistics & Operations Apprentice" },
    org: "Ambev",
    summary: {
      pt: "Apoio à gestão de inventário em plataformas internas e à conciliação de guias tributárias do centro de distribuição.",
      en: "Supported warehouse inventory tracking on internal platforms and tax reconciliation at the distribution center.",
    },
  },
];
