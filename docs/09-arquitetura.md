# 09 — Arquitetura Expo, engenharia e operações

## Stack proposta (confirmar versões antes do primeiro commit)

- Expo + React Native + TypeScript estrito + Expo Router.
- pnpm com lockfile versionado; EAS Build/Submit.
- `expo-sqlite`, `expo-notifications`, `react-native-svg`.
- `react-hook-form` + `zod` (esquemas de UI/domínio separados).
- Zustand para estado de tela, **não** duplicar verdade persistente do SQLite.
- Biblioteca de datas com IANA timezone e testes de calendário; escolher após *spike*.
- Testes: Vitest/Jest conforme ambiente compatível, `@testing-library/react-native`, cenários E2E com Maestro ou Detox avaliados.
- Formatter, linter, TypeScript no CI; versões fixas nas dependências críticas.

## Organização proposta

```text
app/                         rotas do Expo Router
src/
  core/
    recurrence/              motor puro: dias, ciclos, slots, exceções
    datetime/                data local e timezone
    domain/                  invariantes, modelos, validações
  features/
    onboarding/
    medications/
    schedules/
    calendar/
    history/
    alarms/
    settings/
  data/
    sqlite/                  schema e migrations
    repositories/            consultas e transações
  integrations/
    native-notifications/    adapter Expo/nativo
  components/
    ui/
    softcare-icons/
  theme/                     tokens, typography, spacing
  localization/              pt-BR; futura internacionalização
assets/
  icons/softcare/            SVGs originais
  illustrations/
  sounds/
tests/
  unit/
  integration/
  e2e/
  devices/
docs/
.github/workflows/
```

## Camadas e dependências

- Domain não importa React Native, Expo, UI ou SQLite.
- Persistence depende de Domain; adapter de notificações usa contratos estáveis de ocorrência e permissões.
- Interface depende de casos de uso/repositórios; salvar → transação → reconcile.
- Horário atual e fuso sempre injetáveis nos testes.
- Nenhum dado sensível em console.log, ferramentas de analytics ou crash reports.

## Regras de qualidade

- Branch de feature, PR pequeno, revisão, CI verde e prova visual antes de merge na main.
- Commit por checkpoint; convenção `feat`, `fix`, `docs`, `test`, `chore`.
- Proteção contra dupla escrita/duplo toque, erros de permissão e exceções não tratadas.
- Testes unitários obrigatórios no core antes de integrar notificações.
- Tratar alterações de banco com migração reversível quando possível.
- Sem dependência de conta, token de nuvem ou servidor na versão inicial.

## Configuração de release

- `development`, `preview`, `production`; applicationId único a decidir **antes de publicar**.
- Versionamento `versionName`/`versionCode`, Android App Bundle `.aab` para Play, `.apk` para testes locais.
- Assinatura e credenciais mantidas fora do Git; Android App Signing conforme fluxo da Play.
- Updates OTA somente após avaliar impacto de mudanças JS versus dependências nativas/SDK; schema compatível e rollback.
- Projeto Expo preparado para API 36 como alvo de publicação em 2026; verificar compatibilidade da versão Expo/RN no momento de implementação.
