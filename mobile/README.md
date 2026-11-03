# KAlarm — Expo e pnpm

Aplicativo React Native + Expo SDK 57 com identidade SoftCare, SQLite e lembretes locais.

## Ambiente recomendado: Development Build

O KAlarm **importa `expo-notifications` na inicialização**. Uma falha conhecida do Expo Go 57 no Android podia encerrar o aplicativo imediatamente durante esse import. Por isso, **não considere Expo Go um ambiente válido para confirmar que os alarmes estão funcionando**.

```powershell
git switch fix/cp08-expo-go-stability
cd mobile
pnpm install
pnpm exec expo install --check
pnpm run check:entry
pnpm run android
```

O comando `pnpm run android` compila uma Development Build usando seu Android SDK e instala o app no dispositivo/emulador. Para iniciar o servidor posteriormente:

```powershell
pnpm start:dev
```

## Para isolar falhas do Expo Go (somente inspeção de UI)

```powershell
pnpm start:go:clear
```

Isso força o alvo Expo Go. Atualize ou instale a versão correspondente ao SDK 57 pelo [Expo Go Android](https://expo.dev/go?platform=android&sdkVersion=57). Se o app fechar durante a importação de notificações, **não tente contornar isso apagando o banco**; use a Development Build. O código de notificações da aplicação não está sendo desativado silenciosamente.

O comando `pnpm start` continua apontando para a Development Build, por escolha deliberada. `pnpm start:go` e `pnpm start:go:clear` são opções apenas para diagnóstico.

## Identificar a falha

Se o aplicativo ainda fechar:

```powershell
adb logcat -c
# Abra o aplicativo, espere a falha e, depois:
adb logcat -b crash -d
```

No terminal Metro, também confira erros de JavaScript. Em caso de erro `no such table` ou `SQLite`, utilize o erro mostrado pelo KAlarm e **não apague os dados para tentar corrigir automaticamente**.

## Verificações

```powershell
pnpm run check:entry
pnpm run check
pnpm exec expo-doctor
pnpm exec expo export --platform android --output-dir .expo-ci-bundle
```

As notificações dependem de permissões e de testes reais no Android; o bundle compilado não comprova entrega pontual.
