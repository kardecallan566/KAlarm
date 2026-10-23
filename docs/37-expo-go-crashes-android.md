# CP08 — Expo Go fecha sozinho no Android

## Diagnóstico baseado no código do KAlarm

A branch anterior usava `pnpm start` → `expo start --dev-client`, enquanto o usuário estava testando com Expo Go. São destinos de execução diferentes. O `mobile/package.json` foi ampliado com `start:go`, `start:go:clear` e `start:dev` para remover ambiguidade.

O SDK em uso é Expo 57. O arquivo `mobile/app/_layout.tsx` importa `expo-notifications` no topo, e há um bug documentado na linha 57 Android no qual **a importação do módulo encerra o Expo Go** (expo/expo#49062; corrigido na linha 58). Isso pode causar fechamento sem tela vermelha. Portanto, uma Development Build é o alvo recomendado para o KAlarm com notificações.

A inicialização do SQLite usava `SQLiteProvider useSuspense` sem fallback explícito. Adicionamos `React.Suspense` para exibir progresso, e uma `StartupErrorBoundary` para mostrar erro de inicialização/migração sem resetar o banco.

Outras hipóteses que dependem dos logs reais:
- versão instalada do Expo Go não corresponde ao SDK 57;
- versão antiga do Expo Go 57 com crash nativo conhecido;
- dependências instaladas em diretório errado, versões divergentes de Metro/React Native;
- corrupção/migração SQLite ou erro JS em uma rota, ainda não demonstrados;
- problemas de conexão LAN (isso normalmente produz tela de erro de rede e não um SIGSEGV).

## Passos de reprodução no Windows usando pnpm

```powershell
cd mobile
pnpm install
pnpm exec expo install --check
pnpm start:go:clear
```

Se o Expo Go sair para a tela inicial sem um erro JS, conecte o celular e capture `adb logcat -b crash -d`. Um crash em biblioteca nativa requer análise do stacktrace.

**Teste prioritário:** criar e executar o KAlarm como Development Build (`pnpm run android`), que inclui os módulos nativos compatíveis com o projeto. Não realizar upgrade major de Expo 57 para 58 sem uma migração/testes coordenados.

## Verificações do checkpoint

- `pnpm run check` (TypeScript)
- `pnpm exec expo export --platform android` (bundle Metro)
- Abrir em Android físico com o app bloqueado e depois em segundo plano; confirmar funcionamento de banco e navegação.
- Confirmar se os fechamentos continuam na Development Build e coletar logs para diferenciação.

Referências:
- https://github.com/expo/expo/pull/49062
- https://docs.expo.dev/more/expo-cli/
- https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/
- https://docs.expo.dev/versions/latest/sdk/sqlite/
