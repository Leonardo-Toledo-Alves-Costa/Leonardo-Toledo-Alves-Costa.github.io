import type { Profile } from "./types";

// Fonte: currículos "Software" PT/EN (out/2026). Sem telefone — nunca.
export const profile: Profile = {
  name: "Leonardo Tolêdo",
  headline: {
    pt: "Engenharia de Computação · software ⇄ hardware",
    en: "Computer Engineering · software ⇄ hardware",
  },
  bio: {
    pt: "Estudante de Engenharia de Computação na UNIFEI em busca de estágio em desenvolvimento de software. Experiência prática no ciclo completo de aplicações — do requisito à entrega —, em infraestrutura em nuvem e na liderança de equipes ágeis.",
    en: "Computer Engineering undergraduate at UNIFEI seeking a software engineering internship. Hands-on experience across the full feature lifecycle — from requirements to production —, cloud infrastructure, and leading agile engineering squads.",
  },
  location: "Itajubá, MG",
  email: "ltoledo.alves@gmail.com",
  links: {
    github: "https://github.com/Leonardo-Toledo-Alves-Costa",
    linkedin: "https://linkedin.com/in/leonardotac",
  },
  // cv: só quando existir PDF sem telefone (até lá o botão "Baixar CV" fica oculto).
  specs: [
    {
      label: { pt: "Formação", en: "Education" },
      value: { pt: "Eng. de Computação · UNIFEI", en: "B.Sc. Computer Engineering · UNIFEI" },
    },
    {
      label: { pt: "Período", en: "Stage" },
      value: { pt: "4º período · formatura dez/2029", en: "4th semester · graduating Dec 2029" },
    },
    {
      label: { pt: "Pesquisa", en: "Research" },
      value: { pt: "Iniciação Científica · GCP + Docker", en: "Undergraduate research · GCP + Docker" },
    },
    {
      label: { pt: "Liderança", en: "Leadership" },
      value: { pt: "Diretor de Projetos · Asimov Jr. (~30 devs)", en: "Director of Projects · Asimov Jr. (~30 devs)" },
    },
  ],
  award: {
    pt: "Vencedor mundial JEWC/ENEJ — Projeto de Impacto",
    en: "Global Winner JEWC/ENEJ — Impact Project",
  },
};
