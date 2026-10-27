# CP11 — Migração do KAlarm para Expo SDK 58

## Causa e objetivo

O Expo Go instalado no aparelho usa SDK 58, e o KAlarm estava em SDK 57. O Expo Go exige SDK compatível. Este checkpoint atualiza o projeto na raiz (`app/`, `src/`, `assets/`) de maneira incremental **SDK 57 → SDK 58**, sem mudar o identificador `com.kardec.kalarm` ou a estrutura SQLite.

## Dependências atualizadas

- Expo `^58.0.0`
- React Native `0.88.0` e React `19.3.0`
- Expo Router `~58.0.20`
- `expo-notifications ~58.1.6`
- `expo-sqlite ~58.0.14`
- `expo-dev-client ~58.0.15`
- `expo-constants ~58.0.13`, `expo-linking ~58.0.14`, `expo-status-bar ~58.0.4`
- `react-native-safe-area-context ~5.10.1`, `react-native-screens ~4.30.0`, `react-native-svg 15.16.0`

Usar `pnpm exec expo install --check` e `pnpm exec expo-doctor` para detectar versões divergentes, `pnpm exec expo install --fix` para corrigir conforme tabela oficial do SDK.

## Comandos simplificados

```powershell
# Na raiz KAlarm/
git fetch origin
git switch feat/cp11-expo-sdk58-migration
pnpm install
pnpm run check:sdk
pnpm exec expo install --check
pnpm start:clear
```

`pnpm start` agora abre o servidor em modo Expo Go (`--go`); o Android abre pelo QR Code, sem navegar para web. `pnpm start:dev` conserva o modo Development Build. `pnpm start:go:safe` é diagnóstico com notificações desativadas.

## Builds Android após upgrade

Se já existe pasta `android/` gerada localmente no SDK 57, regerar o projeto nativo para SDK 58 antes de instalar a Development Build. Preserve qualquer mudança nativa manual antes de executar comandos destrutivos:

```powershell
pnpm exec expo prebuild --platform android --clean
pnpm run android
```

O SDK 58 usa `compileSdkVersion 37`. Configure Android SDK/JDK conforme documentação Expo/RN. Não reinstale limpando dados do aplicativo para solucionar erro de bundle sem backup.

## Compatibilidade e riscos

- SDK 58 muda React Native de 0.86 para 0.88. O TypeScript Strict API torna algumas tipagens mais exigentes. Validar as telas e componentes nativos.
- Expo Router tem alterações internas; KAlarm usa Stack/Tabs padrões, mas a navegação precisa ser validada em Android.
- As notificações locais são suportadas no Expo Go Android do SDK 58; notificações remotas não são. O KAlarm deve testar entrega real em Development Build.
- SQLite mantém nome `kalarm.db` e deve preservar os dados existentes; testar migração `user_version`.
- O erro de incompatibilidade de SDK é removido apenas quando **o aparelho e o servidor** realmente usam SDK 58.
- Não prometer precisão temporal de alarmes sem testes físicos.

Referências:
- https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/
- https://expo.dev/changelog/sdk-58
- https://docs.expo.dev/versions/v58.0.0/sdk/router/
- https://docs.expo.dev/versions/v58.0.0/sdk/notifications/
