# KAlarm · Aplicativo de lembretes de medicamentos

Aplicativo **Android/iOS** em **React Native + Expo SDK 58 + TypeScript**, com identidade SoftCare, programação de doses, SQLite local e lembretes experimentais.

O **Expo está na raiz do repositório**: não existe necessidade de entrar numa pasta `mobile/`.

## Como executar com pnpm

Abra um terminal na raiz de KAlarm:

```powershell
git fetch origin
git switch feat/cp11-expo-sdk58-migration
pnpm install
pnpm run check:project
pnpm start:clear
```

O `pnpm start` ou `pnpm start:clear` inicia o **Expo Go SDK 58 para Android**, sem selecionar a web. Leia o QR Code pelo Expo Go 58 do celular. Se o Android estiver conectado por USB e o `adb devices` o reconhecer, use `pnpm start:android:go`.

O modo `pnpm start:go:safe` fica disponível apenas para diagnóstico e **não agenda notificações**. Para testar com o módulo nativo de notificações funcionando, prefira instalar uma Development Build.

### Instalar e testar o KAlarm real no Android

```powershell
pnpm run android
# Nas próximas sessões com o app já instalado:
pnpm start:dev
```

Este projeto ainda é experimental: a entrega exata dos alarmes não foi comprovada em aparelho físico. O modo Expo Go pode ter limitações nativas específicas.

## Se o Expo Go indicar SDK 57 por engano

Certifique-se de que você está na branch CP11 e de que a dependência `expo` instalada é SDK 58:

```powershell
git branch --show-current
pnpm install
pnpm run check:sdk
pnpm exec expo install --check
pnpm start:clear
```

Se houver `android/` e `ios/` gerados anteriormente pelo SDK 57, esses diretórios locais devem ser **regenerados para SDK 58 antes da próxima build nativa**. Não apague dados do KAlarm já instalado nem pastas com código nativo personalizado. Veja [a migração SDK 58](docs/40-cp11-expo-sdk58.md).

## Estrutura

```text
KAlarm/
├── app/                 # rotas e telas Expo Router
├── src/                 # componentes, SQLite e lembretes
├── assets/              # 30 ícones SoftCare, logotipos e referências
├── scripts/             # diagnósticos e testes
├── docs/                # decisões, especificações e checkpoints
├── proofs/              # provas de conceito e testes isolados
├── package.json         # comandos pnpm / dependências Expo
├── app.json             # identidade Android e iOS
├── eas.json             # perfis de build
├── metro.config.js
└── index.js
```

## Qualidade e segurança

```powershell
pnpm run check:project
pnpm run test:go-mode
pnpm exec expo-doctor
pnpm exec expo export --platform android --output-dir .expo-ci-bundle
```

O KAlarm guarda dados de medicação localmente no protótipo, ainda sem criptografia. **Não utilize esta versão experimental como único mecanismo para lembrar medicações importantes.**

A migração está na branch `feat/cp11-expo-sdk58-migration`; a `main` não foi alterada. Leia também [o plano do CP10](docs/39-cp10-expo-raiz-repositorio.md).
