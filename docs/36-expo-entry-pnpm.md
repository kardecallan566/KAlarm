# Correção da entrada do Expo Router com pnpm

## Sintoma

`ConfigError: Cannot resolve entry file: The main field defined in your package.json points to an unresolvable or non-existent path.`

## Diagnóstico

A configuração anterior usava `main: expo-router/entry`, que é aceita oficialmente pelo Expo Router. O erro de inicialização também acontece quando a dependência não está instalada no projeto ativo ou quando o gerenciador de pacotes não expõe a entrada esperada. Não há evidência suficiente para afirmar qual dos dois ocorreu no computador do usuário.

## Mudanças

- Entrada explícita `mobile/index.js`, importando `expo-router/entry`.
- `main: ./index.js` no manifesto, garantindo que o arquivo inicial existe no repositório.
- `mobile/pnpm-workspace.yaml` com `nodeLinker: hoisted` para reduzir problemas de resolução com Metro e pnpm.
- Verificador independente `scripts/check-entry.cjs` usado antes de iniciar o Metro e no CI.
- Validação de bundle JavaScript Android no workflow GitHub Actions.

## Teste mínimo

```bash
cd mobile
pnpm install
pnpm run check:entry
pnpm exec expo install --check
pnpm start:clear
```

`pnpm run android` compila o aplicativo Android (necessita SDK/JDK e dispositivo). A verificação de bundle não equivale a APK ou validação de alarmes em hardware.

## Referências

- https://docs.expo.dev/router/installation/
- https://docs.expo.dev/more/create-expo/
