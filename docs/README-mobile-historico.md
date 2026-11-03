> **ARQUIVO HISTÓRICO (antes do CP10).** O Expo agora está na raiz do KAlarm. Use o [README principal](../README.md) para os comandos atuais. O texto abaixo preserva as instruções anteriores para referência.

# KAlarm — execução com pnpm (Expo SDK 57)

## Abrir especificamente no Android (sem navegador)

No terminal do computador, **abra a pasta `KAlarm/mobile` antes de executar o Expo**. O servidor Metro pode exibir um endereço HTTP local; isso não transforma o aplicativo em site.

### Expo Go 57 — apenas interface e SQLite

```powershell
pnpm start:android:go:safe
```

Com o celular conectado por USB (e `adb devices` mostrando o dispositivo) ou com um emulador aberto, o Expo tentará abrir diretamente no Android. Se usar um celular **sem USB**, execute `pnpm start:go:safe` e leia o QR Code pelo aplicativo Expo Go. O Expo Go instalado deve ser compatível com o **SDK 57**.

### KAlarm instalado no Android — com módulos nativos

```powershell
pnpm run android
# Na próxima execução, com o KAlarm já instalado:
pnpm start:android:dev
```

Use `pnpm start:dev` se desejar somente o QR Code, sem exigir que `adb` encontre um dispositivo. A Development Build é a recomendada para alarmes. Pressionar **W** na CLI Expo abre intencionalmente a versão web, enquanto **A** seleciona Android.

A forma correta de limpar o cache é `pnpm exec expo start --clear` (o subcomando `start` vem antes do argumento `--clear`).

## O Expo Go abre e fecha sozinho?

Há bugs conhecidos na linha SDK 57 do Expo Go Android, inclusive um crash no import de `expo-notifications`. O KAlarm usava essa biblioteca logo na inicialização. Para localizar o problema, disponibilizamos **dois modos separados**:

### 1. Testar interface + SQLite no Expo Go, sem notificações

```powershell
git fetch origin
git switch fix/cp09-expo-go-safe-mode
cd mobile
pnpm install
pnpm start:go:safe
```

Abra no **Expo Go** pelo QR code. O modo seguro substitui `expo-notifications` no bundle Metro por um adaptador que **não agenda avisos e não concede permissões fictícias**. Uma faixa informativa aparece na tela inicial. É possível testar UI, cadastro e SQLite, mas **não os alarmes**.

### 2. Se ainda fechar: teste mínimo do React Native

Encerre o servidor anterior com Ctrl+C e execute:

```powershell
pnpm start:smoke
```

Esse teste não importa Expo Router, SQLite nem notificações em tempo de execução. Deve aparecer a mensagem **KAlarm · Teste básico OK**.

- Se o modo mínimo também fechar, a hipótese principal passa a ser a versão do Expo Go, Hermes/React Native ou o ambiente do dispositivo, e não o código de medicações.
- Se o teste mínimo funcionar mas o modo seguro fechar, investigaremos Router, SQLite e outros módulos do projeto.
- Se ambos funcionarem, o problema provavelmente era causado pelo uso de notificações no Expo Go.

Garanta que o Expo Go instalado no Android é compatível com a **SDK 57**: https://expo.dev/go?platform=android&sdkVersion=57

### 3. Testar o KAlarm com alarmes reais (recomendado)

```powershell
# Dentro de mobile/ e com Android SDK e dispositivo conectado:
pnpm run android
pnpm start:dev
```

A Development Build contém as bibliotecas nativas do projeto. Use-a para verificar permissões, fila e avisos em dispositivo físico.

### Como obter o erro verdadeiro em um Android conectado

```powershell
adb logcat -c
# Abra o app e reproduza o fechamento; em seguida:
adb logcat -b crash -d
```

Também copie o erro do Metro caso ele apareça. Não apague nem limpe os dados do KAlarm sem backup: o protótipo registra informações de medicação localmente.

### Verificações úteis

```powershell
pnpm run check:entry
pnpm run test:go-mode
pnpm run check
pnpm exec expo-doctor
```

**Atenção:** uma exportação JavaScript concluída e os testes do CI não comprovam estabilidade nativa nem entrega pontual de notificações.
