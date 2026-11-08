# AGENTS.md — manual para agentes

Instruções para qualquer agente de IA (Claude, Gemini, Codex…) trabalhando neste repositório. Leia inteiro antes de agir.

## 0. Papéis: o autor é o arquiteto, o agente é o pedreiro
- **Toda decisão é do autor**: arquitetura, stack e dependências, estrutura de arquivos, visual (cor, fonte, layout, animação), textos e conteúdo, comportamento, escopo e qualquer decisão final.
- **O agente implementa, testa e pergunta.** Antes de decidir algo que muda o projeto, pergunta — com opções, uma recomendação e o porquê — e só executa depois da escolha do autor.
- O agente decide sozinho só o miúdo invisível de implementação (nome de variável, organização interna de função, ordem de imports). **Na dúvida, pergunta.**
- Críticas de revisores (Revisão Gemini, bancada, auditorias) que pedem mudança de arquitetura, design ou escopo também vão ao autor antes de serem aplicadas.

## 1. Ordem de leitura no início de toda sessão
1. `docs/00-contexto-zero/` — preferências, papéis, fluxo de trabalho, skills próprias (sem dados pessoais).
2. `docs/01-stacks/projeto-atual.md` — o que este projeto usa (aponta para `catalogo.md`).
3. `docs/02-base-visual/brief.md` — objetivo, público, tom e design do projeto. Neste projeto, também `docs/02-base-visual/autor/sobre-mim.md` (quem é o autor — o assunto do portfólio).
4. `docs/03-memoria/STATUS.md` — **onde paramos**, o que falta, próximo passo, bloqueios.
5. Se houver plano em execução: `docs/03-memoria/planos/` e o ledger em `.superpowers/sdd/<plano>/progress.md`.

> O conteúdo de `docs/` (exceto `docs/README.md`) é local e fica fora do git. Se a pasta não existir na sua cópia, peça o contexto ao autor antes de começar.

## 2. Mapa do repositório
```
AGENTS.md / CLAUDE.md         este manual (CLAUDE.md só importa este arquivo)
docs/
  00-contexto-zero/           GLOBAL: preferências, papéis, fluxo, skills/ (sem dados pessoais)
  01-stacks/                  GLOBAL + projeto: catalogo.md, projeto-atual.md
  02-base-visual/             PROJETO: brief, autor/ (sobre-mim.md, curriculo/), design-system/, inspiracoes/, prototipos/, screenshots/
  03-memoria/                 PROJETO: STATUS, log, decisoes, specs/, planos/, reviews/
  04-testes/                  reservado
src/
  app/[locale]/               telas (rotas /pt e /en)
  components/ui/              peças base do design system
  components/motion/          animações
  components/sections/        seções da página
  components/layout/          nav, troca de idioma, rodapé
  content/                    dados do autor (perfil, skills, trajetória, projetos)
  i18n/                       dicionários PT/EN
  lib/                        utilitários
  styles/globals.css          tokens do design system
tests/unit · tests/e2e        Vitest · Playwright
```

## 3. Ciclo de sessão (obrigatório)
- **Durante:** decisão relevante → `docs/03-memoria/decisoes.md`; referência visual usada → `docs/02-base-visual/inspiracoes/`.
- **Fim:** atualize `docs/03-memoria/STATUS.md` (onde paramos · feito · falta · próximo passo · bloqueios) e acrescente entrada datada em `docs/03-memoria/log.md`.

## 4. Git e versionamento
| Branch | Nasce de | PR para | Versão |
|---|---|---|---|
| `main` | — | — | produção (o que está no ar) |
| `develop` | `main` | `main` | integração |
| `feat/<nome>` | `develop` | `develop` | minor |
| `bugFix/<nome>` | `develop` | `develop` | patch |
| `hotFix/<nome>` | `main` | `main` + merge de volta na `develop` | patch |

Nunca commite direto em `main`/`develop`. Commits em português. Merge de PR só com OK do autor. Toda mudança entra por PR, mesmo quando o autor autoriza o merge direto (`gh pr create` → `gh pr merge`). A branch de trabalho (`feat/`, `bugFix/`, `hotFix/`) só existe enquanto a mudança está em desenvolvimento: no merge, **apague a branch** (local e remota; `gh pr merge --delete-branch`). `hotFix/*`: depois do PR na `main`, levar a `main` para a `develop` (não a branch já apagada). Mudança só de documentação/contexto não sobe versão. Antes do 1.0.0, cada fase do plano sobe `0.x.0` (tabela nas Global Constraints do plano).

## 5. Fluxo de trabalho
**Pensar antes, quebrar em tarefas, depois construir.** Nenhum projeto ou bloco novo começa pelo código.
1. **Pensar:** `superpowers:brainstorming` com o autor → spec → **Revisão Gemini (documento)** → aprovação do autor.
2. **Quebrar:** `superpowers:writing-plans` → plano com o projeto dividido em blocos (fases) e cada bloco em **tarefas pequenas** → **Revisão Gemini (documento)** → aprovação do autor (inclusive da divisão).
3. **Construir, uma tarefa por vez:** tirar perguntas em aberto com o autor → TDD → **Revisão Gemini (código; + visual em UI) antes do commit** → commit → **Bancada de testes** ao fim de fase e antes de release → PR.

Tarefa boa: **um objetivo só** (se precisa de "e" para juntar dois objetivos, são duas); feita, testada, revisada e commitada sozinha; projeto funcionando ao fim; fácil de trocar se o autor mudar de rumo. No plano, cada tarefa traz: objetivo · arquivos · decisões do autor · perguntas em aberto (**não começa enquanto houver alguma**) · pronto quando · testes. Prefira mais tarefas menores a poucas grandes. Detalhes em `docs/00-contexto-zero/fluxo-de-trabalho.md` §3.

### Fluxo de UI (toda tela/componente)
Referência (21st + React Bits + sites) registrada em `docs/02-base-visual/inspiracoes/` → **autor escolhe a direção** (skill `frontend-design` ajuda a montar as opções) → implementar com tokens (nunca cor/fonte solta) → screenshots Playwright 1440×900 e 390×844, PT e EN, em `docs/02-base-visual/screenshots/<tarefa>/` → `audit-suite` + Revisão Gemini lente visual → pendências em `docs/03-memoria/reviews/backlog.md`. Nada é "perfeito": sempre registre o que pode melhorar.

## 6. Ferramentas padrão
| Ferramenta | Quando |
|---|---|
| superpowers | brainstorming, specs, planos, TDD, debugging, verificação antes de concluir |
| frontend-design | toda criação/alteração de UI |
| audit-suite | auditorias por lente; `full-audit` antes de release |
| Playwright (MCP) | screenshots, verificação no navegador, E2E |
| 21st (CLI `21st` + skills `21st-*`) | buscar componentes/animações de referência (`21st search`, `21st get <id>`); adaptar aos tokens e registrar em `21st-componentes.md` |
| React Bits ([reactbits.dev](https://reactbits.dev)) | referência de animações e efeitos de front-end; adaptar aos tokens e a `prefers-reduced-motion`, registrar em `reactbits-componentes.md`. Vários dependem de bibliotecas extras (GSAP, three.js, OGL…) — **dependência nova é decisão do autor** |
| Antigravity CLI `agy` + Gemini | skills próprias abaixo |

### Skills próprias (obrigatórias)
Definidas em `docs/00-contexto-zero/skills/`; plugin local `internal-skills` (`C:/projects/internal-skills`, habilitado em `.claude/settings.json`). Papéis: **o agente implementa e testa; o Gemini critica.** A Revisão Gemini requer `agy` (Antigravity CLI) com login; rode com timeout ≥ 10 min.
- **Revisão Gemini** — ao fim de **toda** tarefa, antes do commit. Aprovado só com nota ≥ 9.0 e sem crítica `critica`/`alta`; caso contrário, corrigir e nova rodada.
  ```bash
  node C:/projects/internal-skills/scripts/revisao.mjs --session <task-NN-nome> --lente codigo|visual|documento \
    --objetivo-file <md> --tarefa-file <md> --contexto-file <md> --arquivos a,b,c --testes-cmd "npm run check"
  ```
- **Bancada de testes** — **executada pelo próprio agente**, uma persona por vez: usuário caótico, hacker, usuário-alvo (recrutador, neste projeto; avalia também visual genérico / "AI slop") e dev sênior, com Playwright e acesso ao código, seguindo `docs/00-contexto-zero/skills/bancada-de-testes/`. Ao fim de cada fase relevante e antes de todo release. Somente contra o build local, nunca produção. Saídas em `.revisoes/bancada/` (fora do git).

## 7. Convenções de código
- TypeScript estrito; sem `any`. Um componente por arquivo, nome em PascalCase.
- Cores, fontes, raios, sombras e curvas de animação **só via tokens** (`src/styles/globals.css`).
- Conteúdo do autor **só** em `src/content/`; textos de interface **só** em `src/i18n/` (PT e EN sempre juntos).
- Animação é aprimoramento: conteúdo visível sem JavaScript e com `prefers-reduced-motion`.
- Acessibilidade WCAG AA; alvos de toque ≥ 44px.
- **Privacidade:** nenhum telefone ou dado pessoal sensível em código, conteúdo, `public/` ou build. Nada de conteúdo inventado.

## 8. Projeto novo a partir deste modelo
Copie `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`, `docs/README.md`, `docs/00-contexto-zero/`, `docs/01-stacks/catalogo.md` e `docs/04-testes/` — a base **não leva dados pessoais**. Crie `docs/01-stacks/projeto-atual.md`, `docs/02-base-visual/` e `docs/03-memoria/` vazios seguindo esta estrutura, e o mesmo bloco `docs/**` no `.gitignore`. `docs/02-base-visual/autor/` só se o novo projeto precisar saber quem é o autor. Depois, adapte as partes deste arquivo que descrevem este projeto (mapa de `src/`, persona-alvo da bancada, convenções de i18n).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
