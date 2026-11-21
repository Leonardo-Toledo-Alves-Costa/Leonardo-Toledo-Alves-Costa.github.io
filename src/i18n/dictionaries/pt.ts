/** Textos de interface em português — o formato deste objeto é o contrato que o inglês precisa seguir. */
export const pt = {
  /** Frases dos grandes momentos (serifa, spec §7). "[PENDENTE]" = aguardando o autor; check:release bloqueia o deploy. */
  statements: {
    f1: "{{[PENDENTE] F1 —}} frase da expansão do orbe",
    f2: "{{[PENDENTE] F2 —}} abertura da trajetória",
    f3: "{{[PENDENTE] F3 —}} fechamento / contato",
    f4: "{{[PENDENTE] F4 —}} abertura de /projetos",
    f5: "{{[PENDENTE] F5 —}} frase central da stack",
  },
  about: {
    /** Texto gigante vazado ao fundo do Sobre (D10, em avaliação pelo autor). */
    backdrop: "UNIFEI",
  },
  highlight: {
    label: "destaque",
    cta: "Ver projetos e stack",
  },
  meta: {
    title: "Leonardo Tolêdo — Engenharia de Computação (UNIFEI) · software e hardware",
    description:
      "Portfólio de Leonardo Tolêdo, estudante de Engenharia de Computação na UNIFEI: projetos, tecnologias e trajetória entre software e hardware.",
  },
  share: {
    ogAlt: "Leonardo Tolêdo — Engenharia de Computação · software ⇄ hardware",
  },
  notFound: {
    title: "Página não encontrada",
    body: "O endereço não existe ou mudou.",
    back: "Ir para o portfólio",
  },
  nav: {
    about: "sobre",
    stack: "stack",
    timeline: "trajetória",
    projects: "projetos",
    learning: "agora",
    contact: "contato",
    label: "Navegação principal",
    menu: "Abrir menu",
    close: "Fechar menu",
  },
  sections: {
    about: "Engenharia, liderança e entrega",
    stack: "Ferramentas, por nível de domínio",
    timeline: "Do primeiro estágio à diretoria",
    projects: "Projetos entregues e premiados",
    learning: "O que estou estudando agora",
    contact: "Aberto a estágio em engenharia de software",
  },
  footer: {
    made: "feito com Next.js",
    code: "código no GitHub",
  },
  common: {
    skipToContent: "Pular para o conteúdo",
    // No idioma de destino (o link tem lang="en"): quem não lê português reconhece.
    switchLanguage: "View in English",
  },
  hero: {
    ctaProjects: "Ver projetos",
    telemetryLabel: "Em resumo",
    statusLabel: "Status",
    scrollHint: "role",
  },
  stack: {
    intro: "Cada tecnologia acende conforme o nível. Selecione uma para ver onde foi usada.",
    legend: "Legenda dos níveis",
    level: "Nível",
    usedIn: "Usado em",
    noProjects: "Sem projeto listado aqui ainda.",
    categories: {
      software: "Software",
      cloud: "Nuvem & DevOps",
      engineering: "Engenharia & métodos",
      hardwareAi: "Hardware · IA · XR",
    },
  },
  projects: {
    intro: "Projetos de cliente e de pesquisa: o código é privado, então o que vale aqui é o que foi entregue.",
    privateCode: "Código privado",
    stack: "Stack",
  },
  contact: {
    intro: "Respondo por e-mail ou LinkedIn. Prefere ver código? O GitHub está logo abaixo.",
    email: "e-mail",
    copy: "copiar",
    copied: "copiado",
    cv: "currículo",
  },
  levels: {
    learning: "estudando",
    used: "usei em projeto",
    proficient: "domino",
  },
  designSystem: {
    title: "Design system — Abissal",
    intro: "Peças base do site: cores, tipografia, componentes e efeitos de luz. Página de referência, fora da navegação.",
    colors: "Cores",
    colorsNote: "Azul profundo afundando no preto, luz cobalto do orbe. O branco acende o que importa; o cinza-azulado é contexto.",
    typeSerif: "Grandes momentos — Instrument Serif 400, em pé, tracking normal (a fonte é estreita), só nas frases de abertura e transição",
    type: "Tipografia",
    buttons: "Botões",
    secondary: "Ver projetos",
    ghost: "Falar comigo",
    ghostArrow: "Ver trajetória",
    pills: "Pílulas de tecnologia",
    pillsInteractive: "Clicável (mostra os projetos que usam a tecnologia, como em /projetos):",
    cards: "Cartão de vidro",
    statement: "Frase dos grandes momentos",
    statementSample: "{{Do requisito}} à entrega.",
    orb: "Orbe",
    orbNote: "Mini, hero e halo. Esta é a camada em CSS: aparece sem JavaScript, com “reduzir movimento” e quando o WebGL falha. O shader entra por cima dela.",
    typeDisplay: "Display — Geist 400, tracking −0.04em, até 64px (nome na abertura)",
    typeSection: "Título de seção — Geist 400, 48px, trecho de contexto apagado",
    typeBody: "Corpo — Geist 400, 16px, até 60 caracteres por linha",
    typeLabel: "Rótulo de seção — Geist Mono 12px, caixa alta, tracking 0.14em",
    typeSectionSample: "Trajetória",
    typeBodySample: "Do requisito à entrega: aplicativos, infraestrutura em nuvem e liderança de equipes ágeis.",
    motion: "Movimento",
    motionNote: "Luz que acompanha a rolagem: só transform e opacidade. Com \"reduzir movimento\" tudo fica no lugar; sem JavaScript, o conteúdo aparece completo.",
    motionReveal: "Este bloco entra suavemente quando chega à tela.",
  },
};
