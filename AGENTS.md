# AGENTS.md — manual para agentes

Instruções para qualquer agente de IA (Claude, Gemini, Codex…) trabalhando neste repositório. Leia inteiro antes de agir.

## 1. Ordem de leitura no início de toda sessão
1. `docs/00-contexto-zero/` — quem é o autor, preferências, fluxo de trabalho, skills próprias.
2. `docs/01-stacks/projeto-atual.md` — o que este projeto usa (aponta para `catalogo.md`).
3. `docs/02-base-visual/brief.md` — objetivo, público, tom e design do projeto.
4. `docs/03-memoria/STATUS.md` — **onde paramos**, o que falta, próximo passo, bloqueios.
5. Se houver plano em execução: `docs/03-memoria/planos/` e o ledger em `.superpowers/sdd/<plano>/progress.md`.

> O conteúdo de `docs/` (exceto `docs/README.md`) é local e fica fora do git. Se a pasta não existir na sua cópia, peça o contexto ao autor antes de começar.

## 2. Mapa do repositório
```
AGENTS.md / CLAUDE.md         este manual (CLAUDE.md só importa este arquivo)
docs/
  00-contexto-zero/           GLOBAL: sobre o autor, preferências, fluxo, skills/, curriculo/
  01-stacks/                  GLOBAL + projeto: catalogo.md, projeto-atual.md
  02-base-visual/             PROJETO: brief, design-system/, inspiracoes/, prototipos/, screenshots/
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

Nunca commite direto em `main`/`develop`. Commits em português. Merge de PR só com OK do autor. Antes do 1.0.0, cada fase do plano sobe `0.x.0` (tabela nas Global Constraints do plano).

## 5. Fluxo de trabalho
`superpowers:brainstorming` → spec → **Revisão Gemini (documento)** → aprovação do autor → `superpowers:writing-plans` → plano → **Revisão Gemini (documento)** → aprovação → execução com TDD → **Revisão Gemini (código; + visual em UI) em toda tarefa, antes do commit** → **Bancada de testes** ao fim de fase e antes de release → PR.

### Fluxo de UI (toda tela/componente)
Referência (21st + sites) registrada em `docs/02-base-visual/inspiracoes/` → skill `frontend-design` → implementar com tokens (nunca cor/fonte solta) → screenshots Playwright 1440×900 e 390×844, PT e EN, em `docs/02-base-visual/screenshots/<tarefa>/` → `audit-suite` + Revisão Gemini lente visual → pendências em `docs/03-memoria/reviews/backlog.md`. Nada é "perfeito": sempre registre o que pode melhorar.

## 6. Ferramentas padrão
| Ferramenta | Quando |
|---|---|
| superpowers | brainstorming, specs, planos, TDD, debugging, verificação antes de concluir |
| frontend-design | toda criação/alteração de UI |
| audit-suite | auditorias por lente; `full-audit` antes de release |
| Playwright (MCP) | screenshots, verificação no navegador, E2E |
| 21st (CLI `21st` + skills `21st-*`) | buscar componentes/animações de referência (`21st search`, `21st get <id>`); adaptar aos tokens e registrar em `21st-componentes.md` |
| Antigravity CLI `agy` + Gemini | skills próprias abaixo |

### Skills próprias (obrigatórias)
Definidas em `docs/00-contexto-zero/skills/` (automação: plugin `leonardo-skills`).
- **Revisão Gemini** — ao fim de **toda** tarefa, antes do commit. Aprovado só com nota ≥ 9.0 e sem crítica `critica`/`alta`; caso contrário, corrigir e nova rodada.
- **Bancada de testes** — dev sênior, usuário caótico, hacker e usuário-alvo; ao fim de cada fase relevante e antes de todo release. Somente contra o build local, nunca produção.

## 7. Convenções de código
- TypeScript estrito; sem `any`. Um componente por arquivo, nome em PascalCase.
- Cores, fontes, raios, sombras e curvas de animação **só via tokens** (`src/styles/globals.css`).
- Conteúdo do autor **só** em `src/content/`; textos de interface **só** em `src/i18n/` (PT e EN sempre juntos).
- Animação é aprimoramento: conteúdo visível sem JavaScript e com `prefers-reduced-motion`.
- Acessibilidade WCAG AA; alvos de toque ≥ 44px.
- **Privacidade:** nenhum telefone ou dado pessoal sensível em código, conteúdo, `public/` ou build. Nada de conteúdo inventado.

## 8. Projeto novo a partir deste modelo
Copie `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`, `docs/README.md`, `docs/00-contexto-zero/`, `docs/01-stacks/catalogo.md` e `docs/04-testes/`. Crie `docs/01-stacks/projeto-atual.md`, `docs/02-base-visual/` e `docs/03-memoria/` vazios seguindo esta estrutura, e o mesmo bloco `docs/**` no `.gitignore`.
