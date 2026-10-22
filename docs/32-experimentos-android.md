# 32 — Protocolo do experimento de alarmes Android (CP03 / A01)

A tela **Verificar alarmes** foi adicionada ao projeto Expo inicial em `mobile/`. Ela verifica permissão de notificação e de alarme exato, lê o número de notificações técnicas agendadas, solicita permissões **quando o usuário toca no botão** e agenda um teste local após 60 segundos.

## O que já é código

- `mobile/src/services/alarmSpike.ts`: consulta, pede permissões, agenda e cancela somente notificações técnicas marcadas como `kind=kalarm-spike`.
- `mobile/app/alarm-test.tsx`: interface com estados reais, instruções e controle de operação.
- `mobile/app/(tabs)`: estrutura navegável, sem dados fictícios apresentados como dados do usuário.
- `mobile/src/components/icons`: integração da biblioteca SoftCare original.

## O que **não** está comprovado

- Instalação de dependências Expo e build Android (depende de máquina conectada ao registro e compilação).
- Entrega exata observada em aparelho físico; tela bloqueada, reboot, Doze, OEM.
- Acesso a alarmes exatos no aparelho do usuário.
- Ações da notificação e persistência de tomadas.
- Suporte ilimitado a ciclos variáveis quando o app fica fechado por semanas.

## Planilha de evidências a preencher (sem inventar resultados)

| Dispositivo | Android | Modo | Permissões | Hora programada | Hora observada | Atraso | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A preencher | — | bestEffort | — | — | — | — | Não testado |
| A preencher | — | alarmClock | — | — | — | — | Não testado |

## Gate

Nenhuma alegação de “alarme garantido” ou “app pronto” até observar entrega e atrasos em aparelhos reais, documentar falhas e aprovar a arquitetura final.

Fontes: https://docs.expo.dev/versions/latest/sdk/notifications/ e https://developer.android.com/about/versions/14/changes/schedule-exact-alarms.
