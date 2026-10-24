# KAlarm · Aplicativo de lembretes de medicamentos

Aplicativo **Android/iOS** em React Native + Expo SDK 57 + TypeScript, com identidade SoftCare, calendário de doses, SQLite local e notificações experimentais.

## Comece aqui — tudo na raiz do repositório

**Não existe mais a pasta `mobile/` como projeto separado.** O `package.json`, o `app.json`, as telas e os comandos Expo estão diretamente na raiz do KAlarm.

```powershell
git clone https://github.com/kardecallan566/KAlarm.git
cd KAlarm
git fetch origin
git switch refactor/cp10-expo-at-repo-root
pnpm install
pnpm run check:project
```

Se você já clonou o KAlarm e está dentro da antiga pasta `mobile`, execute **uma última vez** `cd ..` antes de trocar de branch. Daqui em diante, `git pull`, `pnpm install` e o Expo trabalham no mesmo diretório.

### Abrir o aplicativo no Android

Para **testar a interface e o SQLite com Expo Go 57**, sem ativar alarmes:

```powershell
pnpm start:go:safe
```

No Android, abra o Expo Go compatível com **SDK 57** e escaneie o QR Code. Se o celular estiver conectado via USB e o ADB reconhecer o dispositivo:

```powershell
pnpm start:android:go:safe
```

O Expo Go **SDK 58 não executa diretamente projetos SDK 57**. Para testar notificações reais, não use o modo Expo Go seguro.

Para instalar uma **Development Build** do próprio KAlarm no Android, com SDK Android/JDK configurados:

```powershell
pnpm run android
```

Para as próximas sessões com o KAlarm já instalado:

```powershell
pnpm start:dev
# ou com Android conectado:
pnpm start:android:dev
```

O KAlarm é mobile mesmo quando o Metro exibe um endereço HTTP para o servidor de desenvolvimento. Abrir no navegador pela tecla W não é necessário.

## Estrutura do repositório

```text
KAlarm/
├── app/                     # rotas e telas Expo Router
├── src/                     # componentes, domínio, SQLite e notificações
├── assets/                  # imagens oficiais, 30 ícones PNG, SVGs de referência
├── scripts/                 # diagnóstico Expo Go e validações
├── docs/                    # planejamento, decisões e histórico técnico
├── proofs/                  # testes independentes do motor e banco
├── .github/workflows/       # CI
├── package.json             # pnpm e comandos de execução
├── pnpm-workspace.yaml      # resolução de dependências do pnpm
├── app.json                 # configuração Android/iOS
├── eas.json                 # perfis de build
├── metro.config.js          # resolução Metro e modo Expo Go seguro
├── tsconfig.json            # TypeScript somente do aplicativo
└── index.js                 # entrada do Expo Router
```

Não há alteração do pacote Android `com.kardec.kalarm` nem do banco `kalarm.db` nesta reorganização.

## Verificações

```powershell
pnpm run check:entry
pnpm run test:layout
pnpm run assets:check
pnpm run test:go-mode
pnpm run check
pnpm exec expo-doctor
pnpm exec expo export --platform android --output-dir .expo-ci-bundle
```

Para testar o motor de doses e o SQLite:

```powershell
node --experimental-strip-types --test proofs/scheduling/tests/*.test.ts
node --experimental-strip-types --test proofs/reminders/tests/*.test.ts
python -m unittest discover -s proofs/sqlite/tests -v
```

## Estado do desenvolvimento

Os formulários de medicação, as regras de recorrência e o armazenamento local estão implementados nas branches de desenvolvimento. Os lembretes são **experimentais**, podem atrasar e sua entrega não está homologada em aparelho físico. Expo Go seguro não agenda notificações. O banco SQLite desta fase não está criptografado; não inclua dados sensíveis reais durante os testes.

Esta branch parte dos checkpoints anteriores e **não foi mesclada na `main`**. Para detalhes da reorganização, consulte [o CP10](docs/39-cp10-expo-raiz-repositorio.md). O acervo de planejamento continua em [docs/](docs/), as provas em [proofs/](proofs/) e o catálogo de ícones em [docs/ASSETS-SOFTCARE.md](docs/ASSETS-SOFTCARE.md).

**Não utilizar esta versão experimental como único mecanismo de lembrete de medicamentos importantes.**
