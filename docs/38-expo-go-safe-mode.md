# CP09 — Diagnóstico isolado para Expo Go SDK 57

## Por que a PR #9 não foi suficiente

A PR #9 colocou uma tela de carregamento no SQLite e documentou Development Builds, mas **continuou importando expo-notifications durante o bootstrap**, algo que pode causar crash nativo no Expo Go SDK 57 Android, antes de qualquer Error Boundary JavaScript funcionar.

## Separação de execução

- **Development Build normal:** `pnpm start:dev`, o Metro usa o módulo nativo real do Expo Notifications; nenhuma mudança na lógica de alarmes.
- **Expo Go seguro:** `pnpm start:go:safe`, o processo lança Metro com `KALARM_EXPO_GO_SAFE=1`; `metro.config.js` substitui **somente** imports de `expo-notifications` por `src/compat/expo-notifications-disabled.js`. O adaptador nega solicitações de permissão/agendamento, consulta fila vazia e não cria confirmações fictícias. A interface mostra aviso explícito. SQLite/Router ainda são testados.
- **Teste mínimo:** `pnpm start:smoke`, além do modo seguro seleciona um `index.js` que registra apenas uma tela React Native com o texto `KAlarm · Teste básico OK`. Essa tela não executa Router, banco ou alarmes.

## Evidência e limitações

Há dois problemas distintos conhecidos do SDK 57 Expo Go Android:
1. `expo-notifications` podia provocar fechamento durante o import, corrigido no código do Expo posteriormente (expo/expo#49062).
2. Crashes de Hermes/worklets em alguns aparelhos, que também podem ocorrer em exemplos mínimos (expo/expo#48390), com correções em versões do Expo Go compatíveis.

Este patch é **diagnóstico e isolamento**, não uma garantia de que todo Expo Go SDK 57 Android ficará estável. Também não se deve inferir que o build Android estará funcional apenas por exportar bundle JavaScript.

Testes de CI:
- resolução customizada ativa somente no modo seguro;
- mock não concede permissões;
- exportação de bundle Android normal, modo Go seguro e modo mínimo;
- TypeScript, motor de doses, SQLite e verificação dos ícones.

## Como reproduzir no Windows

```powershell
cd mobile
pnpm install
pnpm start:go:safe
# Se fechar: Ctrl+C e
pnpm start:smoke
# Se ambos fecharem: adb logcat -b crash -d
```

## Referências

- https://github.com/expo/expo/issues/48390
- https://github.com/expo/expo/pull/49062
- https://docs.expo.dev/versions/latest/config/metro/
- https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/
- https://docs.expo.dev/develop/development-builds/faq/
