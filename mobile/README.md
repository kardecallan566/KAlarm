# KAlarm — Aplicativo Expo (React Native)

Projeto Android/iOS com Expo Router, SQLite, notificações locais e o design SoftCare.
O diretório **mobile/** é a raiz do aplicativo: execute os comandos dentro dele.

## Instalação com pnpm

```bash
# A partir da raiz do repositório KAlarm
git switch fix/cp07-expo-router-entry-pnpm
cd mobile
corepack enable
pnpm install
pnpm run check:entry
pnpm exec expo install --check
pnpm start:clear
```

Para compilar e instalar no Android conectado, execute `pnpm run android` (requer SDK Android/JDK e dispositivo ou emulador).

## Correção do erro “Cannot resolve entry file”

- `package.json` aponta para um **arquivo local real** (`./index.js`), que importa `expo-router/entry`.
- O `pnpm-workspace.yaml` utiliza `nodeLinker: hoisted` para reduzir incompatibilidades de resolução no Metro.
- `pnpm run check:entry` identifica dependências ausentes com orientação prática.
- Se `expo-router/entry` não for encontrado, execute `pnpm install` **dentro de `mobile/`** e verifique `pnpm exec expo install --check`.
- Se você instalou dependências de outra branch com estrutura diferente, remova apenas `mobile/node_modules` e faça uma instalação nova com `pnpm install`; depois `pnpm start:clear`.

### Observações

Notificações ainda exigem testes Android em dispositivo real. A execução do Metro não comprova a entrega pontual de alarmes nem substitui uma build de desenvolvimento.

Os ícones e assets estão descritos em [ASSETS-SOFTCARE.md](ASSETS-SOFTCARE.md).
