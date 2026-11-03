# CP10 — O Expo passa a ser executado na raiz do repositório

## Objetivo

O projeto KAlarm é um único app Android/iOS; portanto o diretório `mobile/` separado criava etapas desnecessárias. Este checkpoint reorganiza os arquivos sem trocar o SDK Expo nem alterar as rotinas clínicas.

## O que foi movido

- `mobile/app/` → `app/`
- `mobile/src/` → `src/`
- `mobile/assets/` → `assets/` (sem remover os SVGs já existentes em `assets/icons/softcare/` e `assets/brand/`)
- `mobile/scripts/` → `scripts/`
- `mobile/package.json`, `app.json`, `eas.json`, `index.js`, `tsconfig.json`, `metro.config.js`, `pnpm-workspace.yaml` → raiz
- `mobile/.gitignore` → `.gitignore`
- `mobile/README.md` → `docs/README-mobile-historico.md` (referência histórica, não usar para executar)
- `mobile/ASSETS-SOFTCARE.md` → `docs/ASSETS-SOFTCARE.md`
- `mobile/docs-do-projeto.md` → `docs/CP04-CP05-notas.md`

Os arquivos PNG e SVG foram movidos **preservando os objetos Git originais (hashes/blob SHAs)**. Os caminhos relativos entre `app`, `src` e `assets` permanecem válidos.

## Ajustes obrigatórios

- `tsconfig.json`: limita a compilação TypeScript a `app/` e `src/`. Os protótipos em `proofs/` têm suas próprias suites e não devem entrar no typecheck do app.
- `.github/workflows/logic-tests.yml`: executa pnpm, TypeScript, Expo e validação dos assets na raiz; mantém testes de domínio e SQLite.
- `scripts/check-entry.cjs`: diagnóstico aponta para a raiz em caso de instalação incorreta.
- `scripts/project-layout.test.cjs`: testa manifesto Expo na raiz, entradas, dependências, assets, raiz do workspace e inexistência de `mobile/`.
- `.gitignore`: cobre `node_modules/`, `.expo/`, `.expo-ci-*`, `dist/`, arquivos locais e artefatos de builds nativas.

## Atualização a partir de uma cópia já existente

Se seu terminal estiver dentro de `KAlarm/mobile/`, execute uma última vez `cd ..` antes de trocar de branch. Após a mudança:

```powershell
git fetch origin
git switch refactor/cp10-expo-at-repo-root
pnpm install
pnpm run check:project
pnpm start:go:safe
```

Se a instalação `node_modules` estiver apenas na antiga pasta `mobile`, execute um novo `pnpm install` na raiz. Não apague dados do aplicativo no Android para resolver problemas do servidor Metro.

## Testes de aceite

- `pnpm run test:layout` e `pnpm run check` passam.
- 30 ícones PNG continuam válidos.
- `pnpm exec expo export --platform android` passa no CI.
- Compatibilidade de Expo Go 57 e Development Build permanece a mesma de antes.
- **Teste físico e APK ainda necessários:** mover arquivos não é validar a entrega de notificações.

Documentação Expo: https://docs.expo.dev/router/installation/ e https://docs.expo.dev/router/reference/src-directory/
